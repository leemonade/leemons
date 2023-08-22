/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const { setTimeout } = require('timers/promises');
const mongoose = require('mongoose');
const { Transaction } = require('../models/transaction');
const { TransactionState } = require('../models/transaction-state');

async function checkIfCanRollbackAndWaitToPendingFinishOrTimeout(ctx, tryNumber = 0) {
  const transaction = await Transaction.findOne({
    _id: ctx.meta.transactionID,
    deploymentID: ctx.meta.deploymentID,
  })
    .select(['pending', 'finished'])
    .lean();
  // Si no se encuentra la transaccion lanzamos pete
  if (!transaction) throw new Error(`The transactionID ${ctx.meta.transactionID} don\`t exists`);
  // Si el intento numero 50 es que ya han pasado mas de 5 segundos desde que esperamos a que se completaran las acciones pendientes, no esperamos mas, vamos a lanzar el rollback
  if (tryNumber >= 50) {
    return true;
  }
  // Si aun no han finalizado todos los pendiente esperamos un poco y lo volvemos a intentar
  if (transaction.finished < transaction.pending) {
    await setTimeout(100);
    return checkIfCanRollbackAndWaitToPendingFinishOrTimeout(ctx, tryNumber + 1);
  }
  return true;
}

async function tryToRollbackState(ctx, state, tryNumber = 0) {
  // Si despues de intentarlo 5 veces sigue petando lo ignoramos
  if (tryNumber === 5) {
    return true;
  }
  try {
    if (process.env.DEBUG === 'true')
      console.log(`CALL from "${ctx.action?.name || ctx.event.name}" to  "${state.caller}"`);
    return await ctx.call(state.caller, state.payload);
  } catch (e) {
    return tryToRollbackState(ctx, state, tryNumber + 1);
  }
}

async function safeTransactionStateDelete(_id) {
  try {
    // Tiene TTL no pasa nada por no borrarlo
    await TransactionState.findOneAndDelete({ _id });
  } catch (e) {
    // Nothing
  }
}

/** @type {ServiceSchema} */
module.exports = (broker) => ({
  name: 'transactions',

  actions: {
    new: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }

        const transaction = await Transaction.create({
          deploymentID: ctx.meta.deploymentID,
          pending: 0,
          finished: 0,
          active: true,
        });
        return transaction._id;
      },
    },
    addPendingState: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        if (!ctx.meta.transactionID) {
          throw new Error('Need ctx.meta.transactionID');
        }

        const transaction = await Transaction.findOneAndUpdate(
          {
            _id: ctx.meta.transactionID,
            deploymentID: ctx.meta.deploymentID,
          },
          { $inc: { pending: 1 } },
          { lean: true }
        );

        // console.log(`pendding - ${ctx.meta.transactionID} - ${transaction.pending}`);

        if (!transaction)
          throw new Error(`The transactionID ${ctx.meta.transactionID} don\`t exists`);
        return true;
      },
    },
    addFinishedState: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        if (!ctx.meta.transactionID) {
          throw new Error('Need ctx.meta.transactionID');
        }
        const transaction = await Transaction.findOneAndUpdate(
          {
            _id: ctx.meta.transactionID,
            deploymentID: ctx.meta.deploymentID,
          },
          { $inc: { finished: 1 } },
          { lean: true }
        );
        // console.log(`finished - ${ctx.meta.transactionID} - ${transaction.finished}`);
        if (!transaction)
          throw new Error(`The transactionID ${ctx.meta.transactionID} don\`t exists`);
        return true;
      },
    },
    addTransactionState: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        if (!ctx.meta.transactionID) {
          throw new Error('Need ctx.meta.transactionID');
        }
        if (!_.isString(ctx.params.action)) {
          throw new Error('Field "action" is required and must be string');
        }
        const transaction = await Transaction.findOne({
          _id: ctx.meta.transactionID,
          deploymentID: ctx.meta.deploymentID,
        })
          .select(['active'])
          .lean();

        if (!transaction)
          throw new Error(`The transactionID ${ctx.meta.transactionID} don\`t exists`);
        // Si la transaccion esta activa añadimos el estado por si se hace rollback
        if (transaction.active) {
          await TransactionState.create({
            deploymentID: ctx.meta.deploymentID,
            transaction: ctx.meta.transactionID,
            caller: `${ctx.caller}.${ctx.params.action}`,
            payload: ctx.params.payload,
          });
        } else {
          // Si la transaccion existe pero ya no esta activa automaticamente mandamos lo que nos acaban de mandar a desacerse
          await tryToRollbackState(
            ctx,
            new TransactionState({
              deploymentID: ctx.meta.deploymentID,
              transaction: ctx.meta.transactionID,
              caller: `${ctx.caller}.${ctx.params.action}`,
              payload: ctx.params.payload,
            })
          );
        }
        return true;
      },
    },
    rollbackTransaction: {
      async handler(ctx) {
        console.log(`--- ROLLBACK - ${ctx.meta.transactionID}`);
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        if (!ctx.meta.transactionID) {
          throw new Error('Need ctx.meta.transactionID');
        }

        let transaction = await Transaction.findOne({
          _id: ctx.meta.transactionID,
          deploymentID: ctx.meta.deploymentID,
        })
          .select(['active', 'pending'])
          .lean();

        if (!transaction)
          throw new Error(`The transactionID ${ctx.meta.transactionID} don\`t exists`);

        // Si no esta activo es que ya se esta lanzando algun rollback ignoramos y devolvemos como que esta todo ok
        if (!transaction.active || !transaction.pending) {
          return true;
        }

        // Para protegernos ante multiples llamadas al rollback (lo cual seria un problema) marcamos ya la transaccion como desactivada y le añadimos un numero que solo conoce esta funcion.
        const checkNumber = Math.floor(Math.random() * 500000);
        await Transaction.findOneAndUpdate(
          {
            _id: ctx.meta.transactionID,
            deploymentID: ctx.meta.deploymentID,
          },
          { active: false, checkNumber },
          { lean: true }
        );

        // Esperamos un poco a que todos los posibles update que hayan llegado hasta aqui se ejecuten si o si
        await setTimeout(100);
        // Volvemos a consultar la transaccion y la que tenga el checkNumber sera la que ejecute el rollback y asi nos evitamos duplicados
        transaction = await Transaction.findOne({
          _id: ctx.meta.transactionID,
          deploymentID: ctx.meta.deploymentID,
        })
          .select(['checkNumber'])
          .lean();

        // Solo continua si el checkNumber es igual
        if (transaction.checkNumber !== checkNumber) {
          return true;
        }

        // Esperamos a que hayan terminado todo lo pendiente
        await checkIfCanRollbackAndWaitToPendingFinishOrTimeout(ctx);

        const states = await TransactionState.find({
          deploymentID: ctx.meta.deploymentID,
          transaction: ctx.meta.transactionID,
        })
          .select(['caller', 'payload', 'createdAt'])
          .sort({ createdAt: 'desc' })
          .lean();

        // Empezamos a hacer rollback en orden
        for (let i = 0, l = states.length; i < l; i++) {
          // eslint-disable-next-line no-await-in-loop
          await tryToRollbackState(ctx, states[i]);
          safeTransactionStateDelete(states[i]._id);
        }

        return true;
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});

const { newTransaction } = require('leemons-transactions');

async function createTransactionIDIfNeed({ ignoreTransaction, autoTransaction, ctx }) {
  if (!ignoreTransaction) {
    if (!ctx.meta.transactionID) {
      if (autoTransaction) {
        ctx.meta.transactionID = await newTransaction(ctx);

        if (process.env.DEBUG === true)
          console.log(
            `NEW TRANSACTION from (${ctx.service.name}) ${ctx.action?.name || ctx.event.name}`
          );
      }
    }
  }
}

module.exports = { createTransactionIDIfNeed };

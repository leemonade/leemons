const _ = require('lodash');
const { removePhone } = require('./removePhone');

/**
 * ES: Elimina todos los numeros de teléfono de la familia
 * EN: Delete all family phone numbers
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeFamilyPhones({ family, ctx }) {
  const alreadyPhones = await ctx.tx.db.EmergencyPhones.find({ family }).lean();

  const promises = [];
  _.forEach(alreadyPhones, (phone) => {
    promises.push(removePhone({ id: phone.id, ctx }));
  });

  await Promise.all(promises);

  return true;
}

module.exports = { removeFamilyPhones };

const _ = require('lodash');
const { table } = require('../tables');
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
async function removeFamilyPhones(family, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const alreadyPhones = await table.emergencyPhones.find({ family }, { transacting });

      const promises = [];
      _.forEach(alreadyPhones, (phone) => {
        promises.push(removePhone({ ...phone }, { transacting }));
      });

      await Promise.all(promises);

      return true;
    },
    table.emergencyPhones,
    _transacting
  );
}

module.exports = { removeFamilyPhones };

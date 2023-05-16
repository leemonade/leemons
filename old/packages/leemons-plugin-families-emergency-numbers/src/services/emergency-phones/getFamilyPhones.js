const _ = require('lodash');
const { table } = require('../tables');
const { removePhone } = require('./removePhone');
const {
  getSessionEmergencyPhoneNumbersPermissions,
} = require('./getSessionEmergencyPhoneNumbersPermissions');
const { getPhoneDataset } = require('./getPhoneDataset');

/**
 * ES: Elimina todos los numeros de teléfono de la familia
 * EN: Delete all family phone numbers
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any} userSession - User session for check permissions
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getFamilyPhones(family, userSession, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const permissions = await getSessionEmergencyPhoneNumbersPermissions(userSession, {
        transacting,
      });
      if (permissions.phoneNumbersInfo.view) {
        const alreadyPhones = await table.emergencyPhones.find({ family }, { transacting });
        const promises = [];
        _.forEach(alreadyPhones, ({ id }) =>
          promises.push(getPhoneDataset(id, userSession, { transacting }))
        );
        const datasetValues = await Promise.all(promises);
        return _.map(alreadyPhones, (phone, index) => {
          phone.dataset = datasetValues[index];
          return phone;
        });
      }
      return [];
    },
    table.emergencyPhones,
    _transacting
  );
}

module.exports = { getFamilyPhones };

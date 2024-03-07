const _ = require('lodash');
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
async function getFamilyPhones({ family, ctx }) {
  const permissions = await getSessionEmergencyPhoneNumbersPermissions({ ctx });
  if (permissions.phoneNumbersInfo.view) {
    const alreadyPhones = await ctx.tx.db.EmergencyPhones.find({ family }).lean();
    const promises = [];
    _.forEach(alreadyPhones, ({ id }) => promises.push(getPhoneDataset({ phone: id, ctx })));
    const datasetValues = await Promise.all(promises);
    return _.map(alreadyPhones, (phone, index) => {
      // eslint-disable-next-line no-param-reassign
      phone.dataset = datasetValues[index];
      return phone;
    });
  }
  return [];
}

module.exports = { getFamilyPhones };

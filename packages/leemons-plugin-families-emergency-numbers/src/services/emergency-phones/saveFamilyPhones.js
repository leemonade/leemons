const _ = require('lodash');
const { table } = require('../tables');
const {
  getSessionEmergencyPhoneNumbersPermissions,
} = require('./getSessionEmergencyPhoneNumbersPermissions');
const { createPhone } = require('./createPhone');
const { updatePhone } = require('./updatePhone');
const { removePhone } = require('./removePhone');

/**
 * ES: Crea/Actualiza/Elimina los numeros de teléfono de la familia
 * EN: Create/Update/Delete family phone numbers
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any} phones - Array if phones to save in family
 * @param {any} userSession - User session for check permissions
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function saveFamilyPhones(
  family,
  phones,
  userSession,
  { fromBulk, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      let permissions;

      if (!fromBulk) {
        permissions = await getSessionEmergencyPhoneNumbersPermissions(userSession, {
          transacting,
        });
      }
      if (fromBulk || permissions.phoneNumbersInfo.update) {
        const alreadyPhones = await table.emergencyPhones.find({ family }, { transacting });

        const alreadyPhonesById = _.keyBy(alreadyPhones, 'id');
        const phonesById = _.keyBy(phones, 'id');

        const unknownPhones = [];
        const addPhones = [];
        const updatePhones = [];
        const removePhones = [];
        _.forEach(phones, (phone) => {
          if (phone.id) {
            if (alreadyPhonesById[phone.id]) {
              updatePhones.push(phone);
            } else {
              unknownPhones.push(phone);
            }
          } else {
            addPhones.push(phone);
          }
        });
        _.forEach(alreadyPhones, (phone) => {
          if (!phonesById[phone.id]) {
            removePhones.push(phone);
          }
        });

        const promises = [];

        _.forEach(addPhones, (phone) => {
          promises.push(createPhone({ family, ...phone }, userSession, { transacting }));
        });
        _.forEach(updatePhones, (phone) => {
          promises.push(updatePhone({ family, ...phone }, userSession, { transacting }));
        });
        _.forEach(removePhones, (phone) => {
          promises.push(removePhone({ family, ...phone }, { transacting }));
        });

        await Promise.all(promises);
      }
      return true;
    },
    table.emergencyPhones,
    _transacting
  );
}

module.exports = { saveFamilyPhones };

const _ = require('lodash');
const { getSessionFamilyPermissions } = require('../users/getSessionFamilyPermissions');
const { table } = require('../tables');
const { canViewFamily } = require('../users/canViewFamily');
const { getMembers } = require('./getMembers');

/**
 * Return family detail if have permission
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any} userSession - User session for check permissions
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail(familyId, userSession, { transacting } = {}) {
  const havePermissions = await canViewFamily(familyId, userSession, { transacting });
  if (!havePermissions) throw new Error('You don`t have permission');
  const [family, members, datasetValues, permissions] = await Promise.all([
    table.families.findOne({ id: familyId }, { transacting }),
    getMembers(familyId, { transacting }),
    leemons
      .getPlugin('dataset')
      .services.dataset.getValues('families-data', 'plugins.families', userSession.userAgents, {
        target: familyId,
        transacting,
      }),
    getSessionFamilyPermissions(userSession, { transacting }),
  ]);
  const familyEmergencyNumbers = leemons.getPlugin('families-emergency-numbers');
  if (familyEmergencyNumbers) {
    family.emergencyPhoneNumbers =
      await familyEmergencyNumbers.services.emergencyPhones.getFamilyPhones(
        family.id,
        userSession,
        { transacting }
      );
  }
  family.guardians = members.guardians;
  family.students = members.students;
  family.datasetValues = datasetValues;

  if (!permissions.customInfo.view) {
    family.datasetValues = null;
  }
  if (!permissions.basicInfo.view) {
    family.name = null;
  }
  if (!permissions.guardiansInfo.view) {
    family.guardians = [];
    family.maritalStatus = null;
  }
  if (!permissions.studentsInfo.view) {
    family.students = [];
  }

  return family;
}

module.exports = { detail };

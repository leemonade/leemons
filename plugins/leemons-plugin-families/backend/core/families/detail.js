const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getSessionFamilyPermissions } = require('../users/getSessionFamilyPermissions');
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
async function detail({ familyId, ctx }) {
  const havePermissions = await canViewFamily({ familyId, ctx });
  if (!havePermissions) throw new LeemonsError(ctx, { message: 'You don`t have permission' });
  const [family, members, datasetValues, permissions] = await Promise.all([
    ctx.tx.db.Families.findOne({ id: familyId }).lean(),
    getMembers({ familyId, ctx }),
    ctx.tx.call('dataset.dataset.getValues', {
      locationName: 'families-data',
      pluginName: 'families',
      userAgent: ctx.meta.userSession.userAgents,
      target: familyId,
    }),
    getSessionFamilyPermissions({ ctx }),
  ]);
  const isFamilyEmergencyNumbersInstalled = await ctx.tx.call(
    'deployment-manager.pluginIsInstalled',
    { pluginName: 'families-emergency-numbers' }
  );
  if (isFamilyEmergencyNumbersInstalled) {
    family.emergencyPhoneNumbers = await ctx.tx.call(
      'families-emergency-numbers.emergencyPhones.getFamilyPhones',
      {
        family: family.id,
      }
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

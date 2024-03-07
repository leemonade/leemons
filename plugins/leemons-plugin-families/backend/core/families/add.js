const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { getSessionFamilyPermissions } = require('../users/getSessionFamilyPermissions');

const { addMember } = require('../family-members/addMember');
const { setDatasetValues } = require('./setDatasetValues');
const { recalculeNumberOfMembers } = require('./recalculeNumberOfMembers');
const { getFamilyMenuBuilderData } = require('./getFamilyMenuBuilderData');

/**
 * ES: Crea una nueva familia solo si tiene los permisos para hacerlo, es posible que solo cree
 * ciertas partes de a familia por que no le han dado permiso a crear todos
 * EN: Create a new family only if you have the permissions to do so, you may only create certain
 * parts of the family because you have not been given permission to create everything.
 * @public
 * @static
 * @param {any} data - Data need to create family
 * @param {any} userSession - User session for check permissions
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add({
  name,
  guardians = [],
  students = [],
  datasetValues,
  maritalStatus,
  emergencyPhoneNumbers = [],
  fromBulk,
  ctx,
}) {
  // ES: Primero sacamos los permisos para comprobar a que tiene acceso y a que no
  // EN: First we pull the permissions to check what you have access to and what you do not have access to.
  let permissions;
  if (!fromBulk) {
    permissions = await getSessionFamilyPermissions({ ctx });
    if (!permissions.basicInfo.update)
      throw new LeemonsError(ctx, {
        httpStatusCode: 401,
        message: "You don't have the necessary permissions.",
        allowedPermissions: {
          permissionName: permissions.permissionsNames.basicInfo,
          actions: ['update'],
        },
      });
  }

  // Creating the family
  const familyData = { name };

  if (fromBulk || (permissions.guardiansInfo.update && maritalStatus)) {
    familyData.maritalStatus = maritalStatus;
  }

  let family = await ctx.tx.db.Families.create(familyData);
  family = family.toObject();

  const menuItemConfig = await getFamilyMenuBuilderData({
    family: family.id,
    familyName: family.name,
    ctx,
  });

  const promises = [];

  // Add the family menu item
  promises.push(
    addMenuItemsDeploy({
      keyValueModel: ctx.tx.db.KeyValue,
      item: menuItemConfig,
      ctx,
    })
  );

  // Add guardians if have permission
  if (fromBulk || permissions.guardiansInfo.update) {
    _.forEach(guardians, ({ user, memberType }) => {
      promises.push(addMember({ user, memberType, family: family.id, ctx }));
    });
  }
  // Add students if have permission
  if (fromBulk || permissions.studentsInfo.update) {
    _.forEach(students, ({ user }) => {
      promises.push(addMember({ user, memberType: 'student', family: family.id, ctx }));
    });
  }
  // Add datasetvalues if have permission and have data
  if ((fromBulk && datasetValues) || (permissions?.customInfo.update && datasetValues)) {
    promises.push(setDatasetValues({ family: family.id, values: datasetValues, ctx }));
  }

  // Add phone numbers if plugin installed
  // The plugin validate if user have access to save phones
  const isFamilyEmergencyNumbersInstalled = await ctx.tx.call(
    'deployment-manager.pluginIsInstalled',
    { pluginName: 'families-emergency-numbers' }
  );
  if (emergencyPhoneNumbers && isFamilyEmergencyNumbersInstalled) {
    promises.push(
      ctx.tx.call('families-emergency-numbers.emergencyPhones.saveFamilyPhones', {
        family: family.id,
        phones: emergencyPhoneNumbers,
        fromBulk,
      })
    );
  }

  await Promise.all(promises);
  await recalculeNumberOfMembers({ family: family.id, ctx });
  return family;
}

module.exports = { add };

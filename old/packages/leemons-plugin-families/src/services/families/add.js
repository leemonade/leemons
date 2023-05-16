const _ = require('lodash');
const { getSessionFamilyPermissions } = require('../users/getSessionFamilyPermissions');
const { table } = require('../tables');
const { addMember } = require('../family-members/addMember');
const { setDatasetValues } = require('./setDatasetValues');
const { recalculeNumberOfMembers } = require('./recalculeNumberOfMembers');
const { add: addMenuItem } = require('../menu-builder/add');
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
async function add(
  { name, guardians = [], students = [], datasetValues, maritalStatus, emergencyPhoneNumbers = [] },
  userSession,
  { fromBulk, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Primero sacamos los permisos para comprobar a que tiene acceso y a que no
      // EN: First we pull the permissions to check what you have access to and what you do not have access to.
      let permissions;
      if (!fromBulk) {
        permissions = await getSessionFamilyPermissions(userSession, { transacting });
        if (!permissions.basicInfo.update)
          throw new global.utils.HttpErrorPermissions(401, [
            {
              permissionName: permissions.permissionsNames.basicInfo,
              actions: ['update'],
            },
          ]);
      }

      // Creating the family
      const familyData = { name };

      if (fromBulk || (permissions.guardiansInfo.update && maritalStatus)) {
        familyData.maritalStatus = maritalStatus;
      }

      const family = await table.families.create(familyData, { transacting });

      const menuItemConfig = await getFamilyMenuBuilderData(family.id, family.name, {
        transacting,
      });

      const promises = [];

      // Add the family menu item
      promises.push(
        addMenuItem(menuItemConfig.config, menuItemConfig.permissions, true, { transacting })
      );

      // Add guardians if have permission
      if (fromBulk || permissions.guardiansInfo.update) {
        _.forEach(guardians, ({ user, memberType }) => {
          promises.push(addMember({ user, memberType, family: family.id }, { transacting }));
        });
      }
      // Add students if have permission
      if (fromBulk || permissions.studentsInfo.update) {
        _.forEach(students, ({ user }) => {
          promises.push(
            addMember({ user, memberType: 'student', family: family.id }, { transacting })
          );
        });
      }
      // Add datasetvalues if have permission and have data
      if ((fromBulk && datasetValues) || (permissions?.customInfo.update && datasetValues)) {
        promises.push(setDatasetValues(family.id, userSession, datasetValues, { transacting }));
      }

      // Add phone numbers if plugin installed
      // The plugin validate if user have access to save phones
      const familyEmergencyNumbers = leemons.getPlugin('families-emergency-numbers');
      if (emergencyPhoneNumbers && familyEmergencyNumbers) {
        promises.push(
          familyEmergencyNumbers.services.emergencyPhones.saveFamilyPhones(
            family.id,
            emergencyPhoneNumbers,
            userSession,
            { fromBulk, transacting }
          )
        );
      }

      await Promise.all(promises);
      await recalculeNumberOfMembers(family.id, { transacting });
      return family;
    },
    table.families,
    _transacting
  );
}

module.exports = { add };

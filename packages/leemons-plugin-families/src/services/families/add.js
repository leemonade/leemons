const _ = require('lodash');
const { getSessionFamilyPermissions } = require('../users/getSessionFamilyPermissions');
const { table } = require('../tables');

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
  { name, guardians = [], students = [], datasetValues, maritalStatus },
  userSession,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Primero sacamos los permisos para comprobar a que tiene acceso y a que no
      // EN: First we pull the permissions to check what you have access to and what you do not have access to.
      const permissions = await getSessionFamilyPermissions(userSession, { transacting });
      if (!permissions.basicInfo.update)
        throw new global.utils.HttpErrorPermissions(401, [
          {
            permissionName: permissions.permissionsNames.basicInfo,
            actions: ['update'],
          },
        ]);

      const familyData = {
        name,
        nGuardians: 0,
        nStudents: 0,
      };

      if (permissions.guardiansInfo.update) {
        familyData.nGuardians = guardians.length;
        if (maritalStatus) {
          familyData.maritalStatus = maritalStatus;
        }
      }
      if (permissions.studentsInfo.update) {
        familyData.nStudents = students.length;
      }
      familyData.nMembers = familyData.nGuardians + familyData.nStudents;

      const family = await table.families.create(familyData, { transacting });

      const promises = [];

      // Add guardians if have permission
      if (permissions.guardiansInfo.update) {
        _.forEach(guardians, (guardian) => {
          promises.push(
            table.familyMembers.create(
              {
                ...guardian,
                family: family.id,
              },
              { transacting }
            )
          );
        });
      }
      // Add students if have permission
      if (permissions.studentsInfo.update) {
        _.forEach(students, (student) => {
          promises.push(
            table.familyMembers.create(
              {
                ...student,
                memberType: 'student',
                family: family.id,
              },
              { transacting }
            )
          );
        });
      }
      // Add datasetvalues if have permission and have data
      if (permissions.customInfo.update && datasetValues) {
        promises.push(
          leemons
            .getPlugin('dataset')
            .services.dataset.addValues(
              'families-data',
              'plugins.families',
              datasetValues,
              userSession.userAgents,
              {
                target: family.id,
                transacting,
              }
            )
        );
      }

      // TODO Añadir a todos los miembros el permiso de ver esta familia con la tabla de users:item-permissions
      await Promise.all(promises);
      return family;
    },
    table.families,
    _transacting
  );
}

module.exports = { add };

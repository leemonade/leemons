const _ = require('lodash');
const { getSessionFamilyPermissions } = require('../users/getSessionFamilyPermissions');
const { table } = require('../tables');
const { canUpdateFamily } = require('../users/canUpdateFamily');
const { getMembers } = require('./getMembers');
const { recalculeNumberOfMembers } = require('./recalculeNumberOfMembers');
const { setDatasetValues } = require('./setDatasetValues');
const { addMember } = require('../family-members/addMember');
const { removeMember } = require('../family-members/removeMember');
const { update: updateMenuItem } = require('../menu-builder/update');
const { getFamilyMenuBuilderData } = require('./getFamilyMenuBuilderData');
const { add: addMenuItem } = require('../menu-builder/add');

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
async function update(
  {
    id,
    name,
    guardians = [],
    students = [],
    datasetValues,
    maritalStatus,
    emergencyPhoneNumbers = [],
  },
  userSession,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Cualquier miembro de la familia puede "editar" la familia puede "editar" por que en
      // funcion de los permisos especificos va a poder editar una partes si y otra no o quiza ninguna
      // por eso apesar de ser miembro de la familia y no tener el permiso de editar familias le permitimos pasar este if

      // EN: Any member of the family can "edit" the family can "edit" because depending on the specific
      // permissions he/she will be able to edit some parts yes and some parts no or maybe none at all
      // so even though he/she is a member of the family and does not have the permission to edit families
      // we allow him/her to pass this if
      const havePermissions = await canUpdateFamily(id, userSession, { transacting });
      if (!havePermissions) throw new Error('You don`t have permission');
      // ES: Primero sacamos los permisos para comprobar a que tiene acceso y a que no
      // EN: First we pull the permissions to check what you have access to and what you do not have access to.
      const permissions = await getSessionFamilyPermissions(userSession, { transacting });

      const { guardians: currentGuardians, students: currentStudents } = await getMembers(id, {
        transacting,
      });

      const newFamilyData = {};
      if (permissions.basicInfo.update && name) {
        newFamilyData.name = name;
      }

      // EN: Calcule the guardians to remove and to add comparing the old registers with the new registers
      const removeGuardians = [];
      const addGuardians = [];
      if (permissions.guardiansInfo.update) {
        const currentGuardiansById = _.keyBy(currentGuardians, 'id');
        const guardiansById = _.keyBy(guardians, 'user');
        _.forEach(currentGuardians, (currentGuardian) => {
          if (!guardiansById[currentGuardian.id]) {
            removeGuardians.push(currentGuardian);
          }
        });
        _.forEach(guardians, (guardian) => {
          if (!currentGuardiansById[guardian.user]) {
            addGuardians.push(guardian);
          }
        });
        if (maritalStatus) {
          newFamilyData.maritalStatus = maritalStatus;
        }
      }

      // EN: Calcule the students to remove and to add comparing the old registers with the new registers
      const removeStudents = [];
      const addStudents = [];
      if (permissions.studentsInfo.update) {
        const currentStudentsById = _.keyBy(currentStudents, 'id');
        const studentsById = _.keyBy(students, 'user');
        _.forEach(currentStudents, (currentStudent) => {
          if (!studentsById[currentStudent.id]) {
            removeStudents.push(currentStudent);
          }
        });
        _.forEach(students, (student) => {
          if (!currentStudentsById[student.user]) {
            addStudents.push(student);
          }
        });
      }

      const family = await table.families.update({ id }, newFamilyData, { transacting });

      const menuItemConfig = await getFamilyMenuBuilderData(family.id, family.name, {
        transacting,
      });

      await updateMenuItem(menuItemConfig.config);

      // EN: Remove the guardians/students
      const removePromises = [];
      const removeMembers = removeGuardians.concat(removeStudents);
      if (removeMembers.length) {
        _.forEach(removeMembers, (member) => {
          removePromises.push(removeMember(id, member.id, { transacting }));
        });
      }
      await Promise.all(removePromises);

      // EN: Add the guardians/students
      const addPromises = [];
      if (addGuardians.length) {
        _.forEach(addGuardians, ({ user, memberType }) => {
          addPromises.push(addMember({ user, memberType, family: id }, { transacting }));
        });
      }
      if (addStudents.length) {
        _.forEach(addStudents, ({ user }) => {
          addPromises.push(addMember({ user, memberType: 'student', family: id }, { transacting }));
        });
      }
      await Promise.all(addPromises);

      // EN: Update the dataset data
      if (permissions.customInfo.update && datasetValues) {
        await setDatasetValues(id, userSession, datasetValues, { transacting });
      }

      // Add phone numbers if plugin installed
      // The plugin validate if user have access to save phones
      const familyEmergencyNumbers = leemons.getPlugin('families-emergency-numbers');
      if (emergencyPhoneNumbers && familyEmergencyNumbers) {
        await familyEmergencyNumbers.services.emergencyPhones.saveFamilyPhones(
          family.id,
          emergencyPhoneNumbers,
          userSession,
          { transacting }
        );
      }

      await recalculeNumberOfMembers(id, { transacting });
      return family;
    },
    table.families,
    _transacting
  );
}

module.exports = { update };

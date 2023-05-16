const _ = require('lodash');
const { groupsInstances } = require('../../table');
const { get: getInstance } = require('../instance/get');
const assignStudents = require('../student/assign');
const addGroup = require('./groups/add');
const groupStudentIsAssigned = require('./has');

module.exports = async function addGroupOfStudents(instance, groups, { transacting } = {}) {
  // TODO: Check if group exists in Academic Portfolio

  if ((await getInstance(instance, { columns: ['id'], transacting })).length === 0) {
    throw new global.utils.HttpError(400, 'Instance does not exist');
  }

  const { classByIds } = leemons.getPlugin('academic-portfolio').services.classes;

  let agroupations = await Promise.all(
    groups.map(async ({ group, students, subject }) => {
      if (group) {
        const groupClass = (await classByIds(group, { transacting }))[0];

        if (!groupClass) {
          return null;
        }

        return {
          group,
          type: 'academic-portfolio',
          subject: groupClass?.subject?.id,
          students: groupClass?.students,
        };
      }
      return {
        group: new Date().getTime(),
        type: 'custom',
        subject,
        students,
      };
    })
  );

  agroupations = agroupations.filter(Boolean);

  const usersGroupInstances = (
    await Promise.all(
      agroupations.map(({ group, students }) =>
        Promise.all(
          students.map(async (student) => {
            const exists = await groupStudentIsAssigned(instance, group, student, {
              transacting,
            });
            if (!exists) {
              return {
                group,
                instance,
                student,
              };
            }
            return null;
          })
        )
      )
    )
  )
    .flat()
    .filter(Boolean);

  // EN: Add groups
  // ES: Añadir grupos
  await Promise.all(
    agroupations.map(async ({ group, type, subject }) => ({
      group,
      saved: await addGroup(group, type, subject, { transacting }),
    }))
  );

  if (usersGroupInstances.length) {
    // EN: Add each group students to the instance
    // ES: Añadir cada grupo de estudiantes a la instancia
    // TODO: Check if the students is already assigned to the group and instance
    await groupsInstances.createMany(usersGroupInstances, { transacting });
  }

  const students = [...new Set(agroupations.map(({ students: s }) => s).flat())];

  // EN: Assign students to the instance
  // ES: Asignar estudiantes a la instancia
  await assignStudents(instance, students, { transacting });

  return agroupations;
};

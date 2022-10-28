/**
 * Status evaluated|late|submitted|closed
 * Start date
 * Deadline
 * Visualization
 * alwaysAvailable
 */
const _ = require('lodash');
const { getDates } = require('../dates');
const { assignableInstances, assignations, grades } = require('../tables');
const getUserPermission = require('./permissions/assignableInstance/users/getUserPermission');

module.exports = async function getAssignableInstancesStatus(
  assignableInstanceIds,
  { userSession, transacting }
) {
  const ids = _.uniq(
    Array.isArray(assignableInstanceIds) ? assignableInstanceIds : [assignableInstanceIds]
  );

  const statusObject = {};

  // EN: Get user permissions for each instance
  // ES: Obtener los permisos del usuario para cada instancia
  console.time('permisos');
  await Promise.all(
    ids.map(async (id) => {
      const permissions = await getUserPermission(id, { userSession, transacting });

      if (!permissions.actions.includes('view')) {
        throw new Error(`You do not have permissions to view the instance ${id}`);
      }

      const isTeacher = permissions.actions.includes('edit');

      _.set(statusObject, `${id}.isTeacher`, isTeacher);
    })
  );
  console.timeEnd('permisos');

  const promises = [];

  // EN: Get instance dates
  // ES: Obtener fechas de la instancia
  promises.push(
    ...ids.map(async (id) => {
      _.set(statusObject, `${id}.dates`, await getDates('assignableInstance', id, { transacting }));
    })
  );

  // EN: Get always available
  // ES: Obtener always available
  const getInstances = async () => {
    const instances = await assignableInstances.find(
      {
        id_$in: ids,
      },
      { columns: ['id', 'alwaysAvailable'], transacting }
    );

    instances.forEach(({ id, alwaysAvailable }) => {
      _.set(statusObject, `${id}.alwaysAvailable`, alwaysAvailable);
    });
  };

  promises.push(getInstances());

  // EN: Get assignations data
  // ES: Obtener datos de la asignación
  const assignationsQuery = ids.map((id) => {
    const query = {
      instance: id,
    };

    if (!statusObject[id].isTeacher) {
      query.user = userSession.userAgents[0].id;
    }

    return query;
  });

  console.time('Assignations found');
  const assignationsFound = await assignations.find(
    {
      $or: assignationsQuery,
    },
    { columns: ['instance', 'id', 'user'], transacting }
  );

  const assignationsObject = assignationsFound.reduce(
    (obj, assignation) => ({ ...obj, [assignation.id]: assignation }),
    {}
  );

  console.timeEnd('Assignations found');

  const promises2 = [];

  // DATES
  promises2.push(
    ...assignationsFound.map(async ({ id }) => {
      _.set(assignationsObject, `${id}.dates`, await getDates('assignation', id, { transacting }));
    })
  );

  // GRADES
  console.time('grades');
  const gradesFound = await grades.find(
    {
      assignation_$in: _.map(assignationsFound, 'id'),
      type: 'main',
    },
    { columns: ['grade', 'visibleToStudent', 'subject', 'assignation'] }
  );

  console.timeEnd('grades');

  console.time('promises');
  await Promise.all(promises);
  await Promise.all(promises2);
  console.timeEnd('promises');

  gradesFound.forEach((grade) => {
    if (!assignationsObject[grade.assignation]?.grades) {
      _.set(assignationsObject, `${grade?.assignation}.grades`, [grade]);
    } else {
      assignationsObject[grade?.assignation].grades.push(grade);
    }
  });

  assignationsFound.forEach(({ instance, id }) => {
    if (!statusObject[instance]?.assignations) {
      _.set(statusObject, `${instance}.assignations`, [assignationsObject[id]]);
    } else {
      statusObject[instance].assignations.push(assignationsObject[id]);
    }
  });

  return { statusObject, gradesFound, assignationsFound };
};

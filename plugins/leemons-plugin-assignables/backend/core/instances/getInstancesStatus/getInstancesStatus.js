/**
 * Status evaluated|late|submitted|closed
 * Start date
 * Deadline
 * Visualization
 * alwaysAvailable
 */
const _ = require('lodash');

const { LeemonsError } = require('leemons-error');

const { getStatus } = require('./getStatus');
const { getDates } = require('../../dates');
const {
  getUserPermissionMultiple,
} = require('../../permissions/users/instances/getUserPermissionMultiple');

async function getInstancesStatus({ assignableInstanceIds, ctx }) {
  const { userSession } = ctx.meta;

  const ids = _.uniq(
    Array.isArray(assignableInstanceIds) ? assignableInstanceIds : [assignableInstanceIds]
  );

  const statusObject = {};

  // EN: Get user permissions for each instance
  // ES: Obtener los permisos del usuario para cada instancia

  const permissions = await getUserPermissionMultiple({ assignableInstances: ids, ctx });

  permissions.forEach((permission) => {
    if (!permission.actions.includes('view')) {
      throw new LeemonsError(ctx, {
        message: `You do not have permissions to view the instance ${permission.assignableInstance}`,
      });
    }
    const isTeacher = permission.actions.includes('edit');
    _.set(statusObject, `${permission.assignableInstance}.isTeacher`, isTeacher);
  });

  const promises = [];

  // EN: Get instance dates
  // ES: Obtener fechas de la instancia
  promises.push(
    getDates({ type: 'assignableInstance', instance: ids, ctx }).then((instanceDates) => {
      Object.entries(instanceDates).map(([id, datesObject]) =>
        _.set(statusObject, `${id}.dates`, datesObject)
      );
    })
  );

  // EN: Get always available
  // ES: Obtener always available
  const getInstances = async () => {
    const instances = await ctx.tx.db.Instances.find({
      id: ids,
    })
      .select(['id', 'alwaysAvailable'])
      .lean();

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
      user: userSession.userAgents[0].id,
    };

    return query;
  });

  const assignationsFound = await ctx.tx.db.Assignations.find({
    $or: assignationsQuery,
  })
    .select(['id', 'instance', 'user'])
    .lean();

  const assignationsObject = assignationsFound.reduce(
    (obj, assignation) => ({ ...obj, [assignation.id]: assignation }),
    {}
  );

  const promises2 = [];

  // DATES
  promises2.push(
    getDates({ type: 'assignation', instance: _.map(assignationsFound, 'id'), ctx }).then(
      (assignationDates) => {
        Object.entries(assignationDates).map(([id, datesObject]) =>
          _.set(assignationsObject, `${id}.timestamps`, datesObject)
        );
      }
    )
  );

  // GRADES
  promises2.push(
    ctx.tx.db.Grades.find({
      assignation: _.map(assignationsFound, 'id'),
      type: 'main',
    })
      .select(['grade', 'visibleToStudent', 'subject', 'assignation'])
      .lean()
  );

  const [, gradesFound] = await Promise.all([...promises2, ...promises]);

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

  return ids.flatMap((id) => {
    const instance = statusObject[id];

    if (instance.assignations) {
      return instance.assignations.map((assignation) => ({
        instance: id,
        assignation: assignation.id,
        status: getStatus(assignation, instance),
        dates: instance.dates || {},
        alwaysAvailable: instance.alwaysAvailable,
        timestamps: assignation.timestamps || {},
      }));
    }
    if (statusObject[id].isTeacher) {
      return [
        {
          instance: id,
          assignation: null,
          status: null,
          dates: instance.dates || {},
          alwaysAvailable: instance.alwaysAvailable,
          timestamps: null,
        },
      ];
    }
    return [];
  });
}

module.exports = { getInstancesStatus };

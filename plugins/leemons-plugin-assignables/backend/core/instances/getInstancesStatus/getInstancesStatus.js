/**
 * Status evaluated|late|submitted|closed
 * Start date
 * Deadline
 * Visualization
 * alwaysAvailable
 */
const _ = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { defaultsDeep } = require('lodash');
const { getStatus } = require('./getStatus');
const { getDates } = require('../../dates');
const {
  getUserPermissionMultiple,
} = require('../../permissions/instances/users/getUserPermissionMultiple');
const {
  getModuleActivitiesTimestampsAndGrades,
} = require('../../assignations/getAssignations/getModuleActivitesTimestampsAndGrades');

/**
 * Retrieves the status of multiple instances.
 *
 * @param {Object} options - The options object.
 * @param {Array|string} options.assignableInstanceIds - The IDs of the assignable instances to retrieve the status for.
 * @param {Object} options.ctx - The context object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @return {Array} An array of objects containing the status of each instance.
 * Each object in the array has the following properties:
 * - instance {string} - The ID of the instance.
 * - assignation {string|null} - The ID of the assignation. Null if it is a teacher.
 * - status {string|null} - The status of the assignation. Null if it is a teacher or there are no assignations.
 * - dates {Object} - An object containing the dates related to the instance.
 * - alwaysAvailable {boolean} - Indicates if the instance is always available.
 * - timestamps {Object} - An object containing the timestamps related to the assignation.
 */

async function getInstancesStatus({ assignableInstanceIds, ctx }) {
  const { userSession } = ctx.meta;

  const ids = _.uniq(
    Array.isArray(assignableInstanceIds) ? assignableInstanceIds : [assignableInstanceIds]
  );

  if (!ids.length) {
    return [];
  }

  const statusObject = {};

  // EN: Get user permissions for each instance
  // ES: Obtener los permisos del usuario para cada instancia

  const permissions = await getUserPermissionMultiple({
    assignableInstances: ids,
    ctx,
  });

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
  const assignationsQuery = ids.map((id) => ({
    instance: id,
    user: userSession.userAgents[0].id,
  }));

  const assignationsFound = await ctx.tx.db.Assignations.find({
    $or: assignationsQuery,
  })
    .select(['id', 'instance', 'user'])
    .lean();

  const { dates: modulesDates } = await getModuleActivitiesTimestampsAndGrades({
    assignationsData: assignationsFound,
    ctx,
  });

  const assignationsObject = assignationsFound.reduce(
    (obj, assignation) => ({ ...obj, [assignation.id]: assignation }),
    {}
  );

  const promises2 = [];

  // DATES
  promises2.push(
    getDates({
      type: 'assignation',
      instance: _.map(assignationsFound, 'id'),
      ctx,
    }).then((assignationDates) => {
      Object.entries(assignationDates).map(([id, datesObject]) =>
        _.set(assignationsObject, `${id}.timestamps`, defaultsDeep(datesObject, modulesDates[id]))
      );
    })
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

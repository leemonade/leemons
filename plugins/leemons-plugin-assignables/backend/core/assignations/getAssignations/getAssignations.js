const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { checkPermissions } = require('./checkPermissions');
const { getClassesWithSubject } = require('./getClassesWithSubject');
const { getRelatedAssignationsTimestamps } = require('./getRelatedAssignationsTimestamps');
const { findAssignationDates } = require('./findAssignationDates');
const { findInstanceDates } = require('./findInstanceDates');
const { getGrades } = require('./getGrades');
const { getAssignationStatus } = require('./getAssignationStatus');

async function getAssignations({
  assignationsIds,
  throwOnMissing = true,
  details = true,
  fetchInstance,
  ctx,
}) {
  if (!assignationsIds?.length) return [];
  // Require inside function to avoid circular dependency
  // eslint-disable-next-line global-require
  const { getInstances } = require('../../instances/getInstances');

  // EN: Get the assignations data
  // ES: Obtener los datos de las asignaciones
  const orQueries = [];

  let ids = [];
  assignationsIds.forEach(({ instance, user, id }) => {
    if (id) {
      ids.push(id);
    } else if (instance && user) {
      orQueries.push({ instance, user });
    }
  });

  let assignationsData = await ctx.tx.db.Assignations.find({
    $or: [{ id: ids }, ...orQueries],
  }).lean();

  // EN: Check if the user has permissions
  // ES: Comprobar si el usuario tiene permisos
  const permissions = await checkPermissions({ assignationsData, ctx });
  if (throwOnMissing) {
    if (Object.values(permissions).some((permission) => !permission)) {
      throw new LeemonsError(ctx, {
        message:
          "You don't have permissions to see some of the requested assignations or they do not exist",
      });
    }
  } else {
    assignationsData = assignationsData.filter((assignation) => permissions[assignation.id]);

    Object.values(permissions).filter((permission) => permission);
  }

  const instancesIds = _.map(assignationsData, 'instance');
  ids = _.map(assignationsData, 'id');

  if (!details) {
    return assignationsData.map((assignation) => ({
      ...assignation,
      classes: JSON.parse(assignation.classes),
      metadata: JSON.parse(assignation.metadata),
    }));
  }

  const promises = [];

  promises.push(getClassesWithSubject({ instancesIds, ctx }));

  promises.push(getRelatedAssignationsTimestamps({ assignationsData, ctx }));

  promises.push(findAssignationDates({ assignationsIds: ids, ctx }));
  promises.push(findInstanceDates({ instances: instancesIds, ctx }));

  promises.push(getGrades({ assignationsData, ctx }));

  if (fetchInstance) {
    promises.push(
      getInstances({
        ids: instancesIds,
        details: true,
        ctx,
      }).then((instances) => {
        const instancesByIds = {};

        instances.forEach((instance) => {
          instancesByIds[instance.id] = instance;
        });

        return instancesByIds;
      })
    );
  }

  const [classes, relatedAssignations, timestamps, dates, grades, instances] = await Promise.all(
    promises
  );
  return assignationsData.map((assignation) => {
    const chatKeys = classes[assignation.instance].subjectsIds.map(
      (subject) =>
        `plugins.assignables.subject|${subject}.assignation|${assignation.id}.userAgent|${assignation.user}`
    );

    const status = getAssignationStatus({
      dates: dates[assignation.instance] || {},
      timestamps: timestamps[assignation.id] || {},
    });

    // Returns the assignationObject
    return {
      ...assignation,
      classes: JSON.parse(assignation.classes),
      metadata: JSON.parse(assignation.metadata),
      instance: instances?.[assignation.instance] || assignation.instance,

      relatedAssignableInstances: {
        before: relatedAssignations[assignation.id] || [],
      },
      grades: grades[assignation.id] || [],
      timestamps: timestamps[assignation.id] || {},

      chatKeys,

      ...status,
    };
  });
}

module.exports = { getAssignations };

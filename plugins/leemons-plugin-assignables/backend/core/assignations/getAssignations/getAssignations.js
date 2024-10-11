const { LeemonsError } = require('@leemons/error');
const { map, uniq, keyBy, defaultsDeep } = require('lodash');

const { checkPermissions } = require('./checkPermissions');
const { findAssignationDates } = require('./findAssignationDates');
const { findInstanceDates } = require('./findInstanceDates');
const { getAssignationStatus } = require('./getAssignationStatus');
const { getClassesWithSubject } = require('./getClassesWithSubject');
const { getGrades } = require('./getGrades');
const {
  getModuleActivitiesTimestampsAndGrades,
} = require('./getModuleActivitesTimestampsAndGrades');
const { getRelatedAssignationsTimestamps } = require('./getRelatedAssignationsTimestamps');

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

  const instancesIds = map(assignationsData, 'instance');
  ids = map(assignationsData, 'id');

  if (!details) {
    return assignationsData.map((assignation) => ({
      ...assignation,
      classes: JSON.parse(assignation.classes || null),
      metadata: JSON.parse(assignation.metadata || null),
    }));
  }

  const promises = [];

  promises.push(getClassesWithSubject({ instancesIds, ctx }));

  promises.push(getRelatedAssignationsTimestamps({ assignationsData, ctx }));
  promises.push(getModuleActivitiesTimestampsAndGrades({ assignationsData, ctx }));

  promises.push(findAssignationDates({ assignationsIds: ids, ctx }));
  promises.push(findInstanceDates({ instances: instancesIds, ctx }));

  promises.push(getGrades({ assignationsData, ctx }));

  if (fetchInstance) {
    promises.push(
      getInstances({
        ids: instancesIds,
        details: true,
        ctx,
      }).then((instances) => keyBy(instances, 'id'))
    );
  } else {
    promises.push(
      ctx.tx.db.Instances.find({ id: instancesIds })
        .select({ id: 1, metadata: 1 })
        .lean()
        .then((instances) => keyBy(instances, 'id'))
    );
  }

  const evaluationSystems = {};

  const [
    classes,
    relatedAssignations,
    { dates: moduleActivitiesTimestamps, completion, grades: moduleGrades, status: moduleStatus },
    timestamps,
    dates,
    grades,
    instances,
  ] = await Promise.all(promises);

  const result = assignationsData.map(async (assignation) => {
    const chatKeys = classes[assignation.instance].subjectsIds.map((subject) =>
      ctx.prefixPN(`subject|${subject}.assignation|${assignation.id}.userAgent|${assignation.user}`)
    );

    // Add module child activities timestamps to the assignation timestamps
    defaultsDeep(timestamps, moduleActivitiesTimestamps);

    const status = getAssignationStatus({
      dates: dates[assignation.instance] || {},
      timestamps: timestamps[assignation.id] || {},
    });

    let metadata = JSON.parse(assignation.metadata || null);

    if (completion[assignation.id] || moduleStatus[assignation.id]) {
      metadata = {
        completion: completion[assignation.id] ?? null,
        moduleStatus: moduleStatus[assignation.id] ?? null,
        ...metadata,
      };
    }

    const assignationGrades = grades[assignation.id] || moduleGrades[assignation.id] || [];

    if (instances?.[assignation.instance]?.metadata?.evaluationType === 'auto' && status.finished) {
      const hasMainGrade = assignationGrades?.some((grade) => grade.type === 'main');

      if (!hasMainGrade) {
        const subjects = uniq(classes[assignation.instance].subjectsIds);
        const { program } = classes[assignation.instance].classes[0];

        if (!evaluationSystems[program]) {
          evaluationSystems[program] = ctx.tx.call(
            'academic-portfolio.programs.getProgramEvaluationSystem',
            {
              id: program,
            }
          );
        }

        const evaluationSystem = await evaluationSystems[program];
        const minScale = evaluationSystem.minScale?.number;

        subjects.forEach((subject) => {
          assignationGrades.push({
            subject,
            type: 'main',
            feedback: null,
            grade: minScale,
            gradedBy: 'auto-graded',
            visibleToStudent: true,
          });
        });
      }
    }

    // Returns the assignationObject
    return {
      ...assignation,
      classes: JSON.parse(assignation.classes || null),
      metadata,
      instance: (fetchInstance ? instances?.[assignation.instance] : null) ?? assignation.instance,

      relatedAssignableInstances: {
        before: relatedAssignations[assignation.id] || [],
      },
      grades: assignationGrades,
      timestamps: timestamps[assignation.id] || {},

      chatKeys,

      ...status,
    };
  });

  return Promise.all(result);
}

module.exports = { getAssignations };

const { LeemonsError } = require('@leemons/error');
const { map, uniq, keyBy, defaultsDeep } = require('lodash');

const { getAssignationKeyBuilder } = require('../../../cache/keys/assignations');
const ttl = require('../../../cache/ttl');

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

function getAutoEvaluatedGrades({ assignation, instance, status, evaluationSystems }) {
  const grades = assignation.grades;

  const instanceIsAutoEvaluable = instance?.metadata?.evaluationType === 'auto';

  if (
    !instanceIsAutoEvaluable ||
    !status.finished ||
    grades.some((grade) => grade.type === 'main')
  ) {
    return grades;
  }

  const subjects = instance.subjects?.map(({ subject }) => subject);
  const program = instance.subjects[0].program;

  const evaluationSystem = evaluationSystems[program];
  const minScale = evaluationSystem.minScale?.number;

  subjects.forEach((subject) => {
    grades.push({
      subject,
      type: 'main',
      grade: minScale,
      feedback: null,
      gradedBy: 'auto-graded',
      visibleToStudent: true,
    });
  });

  return grades;
}

async function getAssignations({ assignationsIds, throwOnMissing = true, details = true, ctx }) {
  if (!assignationsIds?.length) {
    return [];
  }

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

  ids = map(assignationsData, 'id');

  if (!details) {
    return assignationsData.map((assignation) => ({
      ...assignation,
      classes: JSON.parse(assignation.classes || null),
      metadata: JSON.parse(assignation.metadata || null),
    }));
  }

  const promises = [
    getRelatedAssignationsTimestamps({ assignationsData, ctx }),
    findAssignationDates({ assignationsIds: ids, ctx }),
    getGrades({ assignationsData, ctx }),

    // TODO: Uncache all activities in the module when sub-activity is modified
    getModuleActivitiesTimestampsAndGrades({ assignationsData, ctx }),
  ];

  const [
    relatedAssignations,
    timestamps,
    grades,
    { dates: moduleActivitiesTimestamps, completion, grades: moduleGrades, status: moduleStatus },
  ] = await Promise.all(promises);

  const result = assignationsData.map(async (assignation) => {
    // Add module child activities timestamps to the assignation timestamps
    defaultsDeep(timestamps, moduleActivitiesTimestamps);

    let metadata = JSON.parse(assignation.metadata || null);

    if (completion[assignation.id] || moduleStatus[assignation.id]) {
      metadata = {
        completion: completion[assignation.id] ?? null,
        moduleStatus: moduleStatus[assignation.id] ?? null,
        ...metadata,
      };
    }

    // Returns the assignationObject
    return {
      ...assignation,
      classes: JSON.parse(assignation.classes || null),
      metadata,

      relatedAssignableInstances: {
        before: relatedAssignations[assignation.id] || [],
      },
      grades: grades[assignation.id] || moduleGrades[assignation.id] || [],
      timestamps: timestamps[assignation.id] || {},
    };
  });

  return Promise.all(result);
}

async function getInstanceMetadataAndSubjects({ instancesIds, ctx }) {
  const [classes, instances] = await Promise.all([
    getClassesWithSubject({ instancesIds, ctx }),
    ctx.tx.db.Instances.find({ id: instancesIds })
      .select({ id: 1, metadata: 1 })
      .lean()
      .then((instances) => keyBy(instances, 'id')),
  ]);

  const instancesById = {};

  Object.values(instances).forEach((instance) => {
    instancesById[instance.id] = {
      ...instance,
      subjects: classes[instance.id].subjectsIds.map((subject) => ({
        subject,
        program: classes[instance.id].classes[0].program,
      })),
    };
  });

  return instancesById;
}

async function addStatusAndInstanceToAssignations({ assignations, fetchInstance, ctx }) {
  const instancesIds = assignations.map((assignation) => assignation.instance);

  const { getInstances } = require('../../instances/getInstances');

  const promises = [findInstanceDates({ instances: instancesIds, ctx })];

  if (fetchInstance) {
    promises.push(
      getInstances({
        ids: instancesIds,
        details: true,
        ctx,
      }).then((instances) => keyBy(instances, 'id'))
    );
  } else {
    promises.push(getInstanceMetadataAndSubjects({ instancesIds, ctx }));
  }

  const [dates, instances] = await Promise.all(promises);

  const evaluationSystems = {};
  const programs = uniq(Object.values(instances).map((instance) => instance.subjects[0].program));

  await Promise.all(
    programs.map(async (program) => {
      evaluationSystems[program] = await ctx.tx.call(
        'academic-portfolio.programs.getProgramEvaluationSystem',
        {
          id: program,
        }
      );
    })
  );

  return assignations.map((assignation) => {
    const status = getAssignationStatus({
      dates: dates[assignation.instance] || {},
      timestamps: assignation.timestamps || {},
    });

    const grades = getAutoEvaluatedGrades({
      assignation,
      instance: instances[assignation.instance],
      status,
      evaluationSystems,
    });

    return {
      ...assignation,
      ...status,

      grades,
      chatKeys: instances[assignation.instance].subjects.map(({ subject }) =>
        ctx.prefixPN(
          `subject|${subject}.assignation|${assignation.id}.userAgent|${assignation.user}`
        )
      ),
      instance: fetchInstance ? instances[assignation.instance] : assignation.instance,
    };
  });
}

async function getAssignationsWithCache({
  assignationsIds,
  throwOnMissing = true,
  details = true,
  fetchInstance,
  ctx,
}) {
  if (!assignationsIds?.length) {
    return [];
  }

  const getAssignationsCacheKeyBuilder = getAssignationKeyBuilder({
    options: { throwOnMissing, details, fetchInstance },
    ctx,
  });

  const cacheKeys = assignationsIds.map(getAssignationsCacheKeyBuilder);
  const cachedAssignations = await ctx.cache.getMany(cacheKeys).then((r) => Object.values(r));

  const assignationsById = {};
  const assignationsByInstanceAndUser = {};

  cachedAssignations.forEach((assignation) => {
    assignationsById[assignation.id] = assignation;
    assignationsByInstanceAndUser[`${assignation.instance}|${assignation.user}`] = assignation;
  });

  const missingIds = assignationsIds.filter(
    (id) => !assignationsById[id.id] && !assignationsByInstanceAndUser[`${id.instance}|${id.user}`]
  );

  if (missingIds.length) {
    const assignations = await getAssignations({
      assignationsIds: missingIds,
      throwOnMissing,
      fetchInstance,
      details,
      ctx,
    });

    const keysToSave = [];

    assignations.forEach((assignation) => {
      assignationsById[assignation.id] = assignation;
      assignationsByInstanceAndUser[
        `${assignation.instance?.id ?? assignation.instance}|${assignation.user}`
      ] = assignation;

      keysToSave.push(
        {
          key: getAssignationsCacheKeyBuilder({ id: assignation.id }),
          val: assignation,
          ttl: ttl.assignations.get,
        },
        {
          key: getAssignationsCacheKeyBuilder({
            instance: assignation.instance?.id ?? assignation.instance,
            user: assignation.user,
          }),
          val: assignation,
          ttl: ttl.assignations.get,
        }
      );
    });

    await ctx.cache.setMany(keysToSave);
  }

  const assignations = assignationsIds.map(
    (id) => assignationsById[id?.id] ?? assignationsByInstanceAndUser[`${id?.instance}|${id?.user}`]
  );

  if (!details) {
    return assignations;
  }

  return await addStatusAndInstanceToAssignations({ assignations, fetchInstance, ctx });
}

module.exports = { getAssignations: getAssignationsWithCache };

const { keyBy, uniq } = require('lodash');
const { LeemonsError } = require('@leemons/error');

const { getStatusForStudent } = require('./getStatusForStudent');
const {
  getUserPermissionMultiple,
} = require('../../permissions/instances/users/getUserPermissionMultiple');
const { getAssignations } = require('../../assignations/getAssignations');
const { getStatusForTeacher, INSTANCE_STATUS } = require('./getStatusForTeacher');

async function getActivitiesPermissions({ instancesIds, ctx }) {
  const permissions = await getUserPermissionMultiple({
    assignableInstances: instancesIds,
    ctx,
  });

  const canViewAllActivities = permissions.every((permission) =>
    permission.actions.includes('view')
  );

  let canEditSomeActivities = false;
  const canEditAllActivities = permissions.every((permission) => {
    const canEdit = permission.actions.includes('edit');

    if (canEdit) {
      canEditSomeActivities = true;
    }

    return canEdit;
  });

  return {
    canViewAllActivities,

    canEditSomeActivities,
    canEditAllActivities,
  };
}

function handleErrors({ canViewAllActivities, canEditSomeActivities, canEditAllActivities, ctx }) {
  if (!canViewAllActivities) {
    throw new LeemonsError(ctx, {
      message: `You do not have permissions to view some of the requested instances or they do not exist`,
      httpStatusCode: 403,
    });
  }

  if (canEditSomeActivities && !canEditAllActivities) {
    throw new LeemonsError(ctx, {
      message: `You can only request the status of one profile at a time`,
      httpStatusCode: 400,
    });
  }
}

async function getTeacherStatus({ instancesIds, ctx }) {
  const pipeline = (ids) => [
    {
      $match: {
        id: {
          $in: ids,
        },
        deploymentID: ctx.meta.deploymentID,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: 'v1::assignables_dates',
        localField: 'id',
        foreignField: 'instance',
        as: 'dates',
        pipeline: [
          {
            $match: {
              type: 'assignableInstance',
            },
          },
        ],
      },
    },
    {
      $addFields: {
        dates: {
          $arrayToObject: {
            $map: {
              input: '$dates',
              as: 'date',
              in: {
                k: '$$date.name',
                v: '$$date.date',
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        instance: '$id',
        dates: '$dates',
        alwaysAvailable: '$alwaysAvailable',
        requiresScoring: '$requiresScoring',
        moduleActivities: '$metadata.module.activities',
      },
    },
  ];

  const instances = await ctx.tx.db.Instances.aggregate(pipeline(instancesIds));

  const moduleActivitiesIds =
    instances.flatMap(
      (instance) => instance.moduleActivities?.map((activity) => activity.id) ?? []
    ) ?? [];

  const allInstancesIds = [...instancesIds, ...moduleActivitiesIds];

  const moduleActivities = await ctx.tx.db.Instances.aggregate(pipeline(allInstancesIds));
  instances.push(...moduleActivities);

  const studentsDataPipeline = [
    {
      $match: {
        isDeleted: false,
        instance: { $in: allInstancesIds },
      },
    },
    {
      $lookup: {
        from: 'v1::assignables_dates',
        localField: 'id',
        foreignField: 'instance',
        as: 'dates',
        pipeline: [
          {
            $match: {
              type: 'assignation',
            },
          },
        ],
      },
    },
    {
      $addFields: {
        dates: {
          $arrayToObject: {
            $map: {
              input: '$dates',
              as: 'date',
              in: {
                k: '$$date.name',
                v: '$$date.date',
              },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'v1::assignables_grades',
        localField: 'id',
        foreignField: 'assignation',
        as: 'grades',
        pipeline: [
          {
            $match: {
              type: 'main',
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        instance: 1,
        id: 1,
        user: 1,
        timestamps: '$dates',
        grades: {
          $map: {
            input: '$grades',
            as: 'grade',
            in: '$$grade.subject',
          },
        },
      },
    },
    {
      $group: {
        _id: '$instance',
        assignations: { $push: '$$ROOT' },
      },
    },
  ];

  const assignations = await ctx.tx.db.Assignations.aggregate(studentsDataPipeline);

  const assignationsByInstanceId = keyBy(assignations, '_id', 'assignations');
  const instancesById = {};

  instances.forEach((instance) => {
    const instanceData = {
      id: instance.instance,
      instance: instance.instance,
      dates: instance.dates,
      alwaysAvailable: instance.alwaysAvailable,
      moduleActivities: instance.moduleActivities,
      requiresScoring: instance.requiresScoring,
      assignations: assignationsByInstanceId[instance.instance]?.assignations ?? [],
    };

    instancesById[instance.instance] = {
      ...instanceData,
      status: getStatusForTeacher(instanceData),
    };
  });

  return instancesIds.map((id) => {
    const instance = instancesById[id];

    if (!instance?.moduleActivities?.length) {
      return instance;
    }

    let evaluatedCount = 0;
    let evaluatingCount = 0;
    let needsEvaluationCount = 0;
    let didNotFinishCount = 0;

    const moduleActivitiesCount = instance.moduleActivities.length;

    instance.moduleActivities.forEach((activity) => {
      const activityStatus = instancesById[activity.id]?.status;

      switch (activityStatus) {
        case INSTANCE_STATUS.EVALUATED:
          evaluatedCount++;
          break;
        case INSTANCE_STATUS.EVALUATING:
          evaluatingCount++;
          break;
        case INSTANCE_STATUS.NEEDS_EVALUATION:
          needsEvaluationCount++;
          break;
        case INSTANCE_STATUS.DID_NOT_FINISH:
          didNotFinishCount++;
          break;
        default:
          break;
      }
    });

    let status;

    if (moduleActivitiesCount === evaluatedCount) {
      status = INSTANCE_STATUS.EVALUATED;
    } else if (evaluatingCount || evaluatedCount) {
      status = INSTANCE_STATUS.EVALUATING;
    } else if (needsEvaluationCount) {
      status = INSTANCE_STATUS.NEEDS_EVALUATION;
    } else if (didNotFinishCount) {
      status = INSTANCE_STATUS.DID_NOT_FINISH;
    }

    return {
      ...instance,
      assignation: null,
      timestamps: {},
      status,
    };
  });
}

async function getStudentStatus({ instancesIds, ctx }) {
  const { userSession } = ctx.meta;
  const userAgentId = userSession.userAgents[0].id;

  const ids = instancesIds.map((id) => ({
    instance: id,
    user: userAgentId,
  }));

  const assignations = await getAssignations({
    assignationsIds: ids,
    fetchInstance: true,
    ctx,
  });

  return assignations.map((assignation) => ({
    instance: assignation.instance.id,
    assignation: assignation.id,
    status: getStatusForStudent(assignation, assignation.instance),
    dates: assignation.instance.dates,
    alwaysAvailable: assignation.instance.alwaysAvailable,
    timestamps: assignation.timestamps,
    _assignation: assignation,
  }));
}

/**
 * Retrieves the status of multiple instances.
 *
 * @param {Object} options
 * @param {Array|string} options.assignableInstanceIds - The IDs of the assignable instances to retrieve the status for.
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
  const instancesIds = uniq(
    Array.isArray(assignableInstanceIds) ? assignableInstanceIds : [assignableInstanceIds]
  );

  if (!instancesIds.length) {
    return [];
  }

  const { canViewAllActivities, canEditSomeActivities, canEditAllActivities } =
    await getActivitiesPermissions({ instancesIds, ctx });

  const isTeacher = canEditAllActivities;

  handleErrors({ canViewAllActivities, canEditSomeActivities, canEditAllActivities, ctx });

  if (isTeacher) {
    return getTeacherStatus({ instancesIds, ctx });
  }

  return getStudentStatus({ instancesIds, ctx });
}

module.exports = { getInstancesStatus };

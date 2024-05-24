const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

const { getStatus } = require('./getStatus');
const {
  getUserPermissionMultiple,
} = require('../../permissions/instances/users/getUserPermissionMultiple');
const { getAssignations } = require('../../assignations/getAssignations');

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
  const pipeline = [
    {
      $match: {
        id: {
          $in: instancesIds,
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
        assignation: null,
        status: null,
        dates: '$dates',
        alwaysAvailable: '$alwaysAvailable',
        timestamps: null,
      },
    },
  ];

  return ctx.tx.db.Instances.aggregate(pipeline);
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
    status: getStatus(assignation, assignation.instance),
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
  const instancesIds = _.uniq(
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

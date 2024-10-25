const { LeemonsError } = require('@leemons/error');
const { uniq } = require('lodash');

const {
  getUserPermissionMultiple,
} = require('../../permissions/instances/users/getUserPermissionMultiple');

const {
  getStatusForStudent,
  INSTANCE_STATUS: STUDENT_INSTANCE_STATUS,
} = require('./getStatusForStudent');
const {
  getStatusForTeacher,
  INSTANCE_STATUS: TEACHER_INSTANCE_STATUS,
} = require('./getStatusForTeacher');
const getAssignations = require('./helpers/getAssignations');
const getClasses = require('./helpers/getClasses');
const getInstances = require('./helpers/getInstances');
const getInstancesById = require('./helpers/getInstancesById');

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
  const { instances, instancesIds: allInstancesIds } = await getInstances({ instancesIds, ctx });
  const assignations = await getAssignations({ instancesIds: allInstancesIds, ctx });
  const classes = await getClasses({ instances, ctx });

  const instancesById = await getInstancesById({
    instances,
    assignations,
    classes,
    getStatusFn: getStatusForTeacher,
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
        case TEACHER_INSTANCE_STATUS.EVALUATED:
          evaluatedCount++;
          break;
        case TEACHER_INSTANCE_STATUS.EVALUATING:
          evaluatingCount++;
          break;
        case TEACHER_INSTANCE_STATUS.NEEDS_EVALUATION:
          needsEvaluationCount++;
          break;
        case TEACHER_INSTANCE_STATUS.NOT_FINISHED_BY_STUDENTS:
          didNotFinishCount++;
          break;
        default:
          break;
      }
    });

    let status;

    if (moduleActivitiesCount === evaluatedCount) {
      status = TEACHER_INSTANCE_STATUS.EVALUATED;
    } else if (evaluatingCount || evaluatedCount) {
      status = TEACHER_INSTANCE_STATUS.EVALUATING;
    } else if (needsEvaluationCount) {
      status = TEACHER_INSTANCE_STATUS.NEEDS_EVALUATION;
    } else if (didNotFinishCount) {
      status = TEACHER_INSTANCE_STATUS.NOT_FINISHED_BY_STUDENTS;
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
  const { instances, instancesIds: allInstancesIds } = await getInstances({ instancesIds, ctx });
  const assignations = await getAssignations({
    instancesIds: allInstancesIds,
    isStudent: true,
    ctx,
  });
  const classes = await getClasses({ instances, ctx });
  const instancesById = await getInstancesById({
    instances,
    assignations,
    classes,
    getStatusFn: getStatusForStudent,
  });

  return instancesIds.map((id) => {
    const instance = instancesById[id];

    if (!instance?.moduleActivities?.length) {
      return { ...instance, assignation: instance.assignations[0] };
    }

    let someLate = false;

    let evaluatedCount = 0;
    let submittedCount = 0;
    let closedCount = 0;
    let startedCount = 0;
    let openedCount = 0;

    const moduleActivitiesCount = instance.moduleActivities.length;

    instance.moduleActivities.forEach((activity) => {
      const activityStatus = instancesById[activity.id]?.status;

      switch (activityStatus) {
        case STUDENT_INSTANCE_STATUS.EVALUATED:
          evaluatedCount++;
          submittedCount++;
          startedCount++;
          openedCount++;
          break;
        case STUDENT_INSTANCE_STATUS.LATE:
          someLate = true;
          submittedCount++;
          startedCount++;
          openedCount++;
          break;
        case STUDENT_INSTANCE_STATUS.SUBMITTED:
          submittedCount++;
          startedCount++;
          openedCount++;
          break;
        case STUDENT_INSTANCE_STATUS.CLOSED:
          closedCount++;
          startedCount++;
          openedCount++;
          break;
        case STUDENT_INSTANCE_STATUS.STARTED:
          startedCount++;
          openedCount++;
          break;
        case STUDENT_INSTANCE_STATUS.OPENED:
          openedCount++;
          break;
        default:
          break;
      }
    });

    let status;

    if (moduleActivitiesCount === evaluatedCount) {
      if (someLate) {
        status = STUDENT_INSTANCE_STATUS.LATE;
      } else {
        status = STUDENT_INSTANCE_STATUS.EVALUATED;
      }
    } else if (submittedCount === moduleActivitiesCount) {
      status = STUDENT_INSTANCE_STATUS.SUBMITTED;
    } else if (closedCount === moduleActivitiesCount) {
      status = STUDENT_INSTANCE_STATUS.CLOSED;
    } else if (startedCount) {
      status = STUDENT_INSTANCE_STATUS.STARTED;
    } else if (openedCount) {
      status = STUDENT_INSTANCE_STATUS.OPENED;
    } else {
      status = STUDENT_INSTANCE_STATUS.ASSIGNED;
    }

    return {
      ...instance,
      assignation: instance.assignations[0],
      timestamps: {},
      status,
    };
  });
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

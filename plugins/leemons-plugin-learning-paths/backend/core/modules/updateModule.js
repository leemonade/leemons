const { omit } = require('lodash');
const { createAssetsAssignables, ASSET_TYPE, ACTIVITY_TYPE } = require('./createAssetsAssignables');

module.exports = async function updateModule({ id, module, published, ctx }) {
  /*
    The asset assignment is a special case, so we need to handle it.

    Firstly we need to create an assignable for them, and to change the provided
    activities array with the new id, and change the type back to activitiy
  */
  const assignablesByAsset = await createAssetsAssignables({ module, ctx });
  const activitiesWithAssignablesReplaced = module.submission.activities.map((activity) => {
    if (activity.type === ASSET_TYPE) {
      return {
        ...activity,
        activity: assignablesByAsset[activity.id],
        type: ACTIVITY_TYPE,
      };
    }

    return activity;
  });

  return ctx.tx.call('assignables.assignables.updateAssignable', {
    assignable: {
      ...omit(module, ['published', 'role']),
      id,
      submission: {
        activities: activitiesWithAssignablesReplaced,
      },
    },
    published,
  });
};

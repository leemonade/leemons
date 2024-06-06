const { pick } = require('lodash');
const createAssignableFromAsset = require('./createAssignableFromAsset');

module.exports = async function updateAssignableOnAssign({ instance, ctx }) {
  const { assignable } = instance;
  const hasChanges =
    instance.metadata?.asset?.title ||
    instance.metadata?.asset?.cover ||
    instance.metadata?.asset?.cover === null;
  if (!(instance.metadata?.isAsset && hasChanges)) {
    return { id: assignable };
  }

  const assignableData = await ctx.tx.call('assignables.assignables.getAssignable', {
    id: assignable,
  });

  if (instance.metadata.asset.title) {
    assignableData.asset.name = instance.metadata.asset.title;
  }

  if (instance.metadata.asset.cover || instance.metadata.asset.cover === null) {
    assignableData.asset.cover = instance.metadata.asset.cover;
  }

  return createAssignableFromAsset({
    assignable: pick(assignableData, [
      'asset.name',
      'asset.tagline',
      'asset.description',
      'asset.tags',
      'asset.color',
      'asset.cover',
      'role',
      'gradable',
      'metadata',
    ]),
    ctx,
  });
};

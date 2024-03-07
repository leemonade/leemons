const _ = require('lodash');
const { getClassesUnderNodeTree } = require('../common/getClassesUnderNodeTree');
const { getProgramTreeTypes } = require('../programs/getProgramTreeTypes');

async function removeGroupFromClassesUnderNodeTree({ groupId, ctx }) {
  const group = await ctx.tx.db.Groups.findOne({ id: groupId }).lean();
  const nodeTypes = await getProgramTreeTypes({ programId: group.program, ctx });
  const classes = await getClassesUnderNodeTree({
    nodeTypes,
    nodeType: 'groups',
    nodeId: groupId,
    ctx,
  });
  await ctx.tx.emit('before-remove-groups-from-classes', {
    groupId,
    classes,
  });
  await ctx.tx.db.ClassGroup.deleteMany({ group: groupId, class: _.map(classes, 'id') });
  await ctx.tx.emit('after-remove-groups-from-classes', {
    groupId,
    classes,
  });
  return true;
}

module.exports = { removeGroupFromClassesUnderNodeTree };

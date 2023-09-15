const { LeemonsError } = require('@leemons/error');
const { getTreeNodes } = require('../common/getTreeNodes');
const { getProgramTreeTypes } = require('./getProgramTreeTypes');

async function getProgramTree({ programId, ctx }) {
  const nodeTypes = await getProgramTreeTypes({ programId, ctx });
  const tree = await getTreeNodes({
    nodeTypes,
    nodeType: 'program',
    nodeId: programId,
    program: programId,
    ctx,
  });
  if (!tree.length) {
    throw new LeemonsError(ctx, { message: 'Program tree is empty' });
  }
  tree[0].value.treeTypeNodes = nodeTypes;
  return tree[0];
}

module.exports = { getProgramTree };

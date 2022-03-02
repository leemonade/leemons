const { getTreeNodes } = require('../common');
const { getProgramTreeTypes } = require('./getProgramTreeTypes');

async function getProgramTree(programId, { transacting } = {}) {
  const nodeTypes = await getProgramTreeTypes(programId, { transacting });
  const tree = await getTreeNodes(nodeTypes, 'program', programId, { transacting });
  tree[0].value.treeTypeNodes = nodeTypes;
  return tree[0];
}

module.exports = { getProgramTree };

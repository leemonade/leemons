const _ = require('lodash');
const { getTreeNodes } = require('./getTreeNodes');

async function getClassesUnderNodeTree(nodeTypes, nodeType, nodeId, { program, transacting } = {}) {
  const getClassNodes = (nodes) => {
    let pNodes = [];
    _.forEach(nodes, (node) => {
      if (node.nodeType === 'class') {
        pNodes.push(node.value);
      } else {
        pNodes = pNodes.concat(getClassNodes(node.childrens));
      }
    });
    return pNodes;
  };

  const treeNodes = await getTreeNodes(nodeTypes, nodeType, nodeId, { program, transacting });

  return getClassNodes(treeNodes);
}

module.exports = { getClassesUnderNodeTree };

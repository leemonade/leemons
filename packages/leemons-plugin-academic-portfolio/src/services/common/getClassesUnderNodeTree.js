const _ = require('lodash');
const { getTreeNodes } = require('./getTreeNodes');

async function getClassesUnderNodeTree(nodeTypes, nodeType, nodeId, { transacting } = {}) {
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

  return getClassNodes(await getTreeNodes(nodeTypes, nodeType, nodeId, { transacting }));
}

module.exports = { getClassesUnderNodeTree };

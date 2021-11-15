const _ = require('lodash');
const { getTree } = require('./getTree');

async function geClassesUnderNodeTree(nodeTypes, nodeType, nodeId, { transacting } = {}) {
  const tree = await getTree(nodeTypes, { transacting });

  const getParentNodes = (nodes) => {
    let pNodes = [];
    _.forEach(nodes, (node) => {
      if (node.nodeType === nodeType && node.value.id === nodeId) {
        pNodes.push(node);
      } else {
        pNodes = pNodes.concat(getParentNodes(node.childrens));
      }
    });
    return pNodes;
  };

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

  return getClassNodes(getParentNodes(tree));
}

module.exports = { geClassesUnderNodeTree };

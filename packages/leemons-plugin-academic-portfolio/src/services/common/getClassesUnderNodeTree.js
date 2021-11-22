const _ = require('lodash');
const { getTree } = require('./getTree');

async function getClassesUnderNodeTree(nodeTypes, nodeType, nodeId, { transacting } = {}) {
  const nodeIds = _.isArray(nodeId) ? nodeId : [nodeId];
  const tree = await getTree(nodeTypes, { transacting });

  const getParentNodes = (nodes) => {
    let pNodes = [];
    _.forEach(nodes, (node) => {
      if (node.nodeType === nodeType && nodeIds.indexOf(node.value.id) >= 0) {
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

module.exports = { getClassesUnderNodeTree };

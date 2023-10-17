const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { getTree } = require('./getTree');

async function getTreeNodes({ nodeTypes, nodeType, nodeId, program, ctx }) {
  if (ctx.callerPlugin !== 'gateway' && ctx.callerPlugin !== 'curriculum')
    throw new LeemonsError(ctx, {
      message: `getTreeNodes only can be called by curriculum plugin (calledFrom: ${ctx.callerPlugin})`,
    });

  const nodeIds = _.isArray(nodeId) ? nodeId : [nodeId];
  const tree = await getTree({ nodeTypes, program, ctx });

  const getParentNodes = (nodes) => {
    let pNodes = [];
    _.forEach(nodes, (node) => {
      if (
        node.nodeType === nodeType &&
        (nodeIds.indexOf(node.value?.id) >= 0 || nodeIds.indexOf(node.treeId) >= 0)
      ) {
        pNodes.push(node);
      } else {
        pNodes = pNodes.concat(getParentNodes(node.childrens));
      }
    });
    return pNodes;
  };

  return getParentNodes(tree);
}

module.exports = { getTreeNodes };

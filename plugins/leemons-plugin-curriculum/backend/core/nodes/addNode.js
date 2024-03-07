const _ = require('lodash');
const { validateAddNode } = require('../../validations/forms');
const { reloadNodeFullNamesForCurriculum } = require('./reloadNodeFullNamesForCurriculum');

async function addNode({ data, ctx }) {
  await validateAddNode({ data, ctx });
  let node = await ctx.tx.db.Nodes.create(data);
  node = node.toObject();
  await reloadNodeFullNamesForCurriculum({ id: data.curriculum, ctx });
  return node;
}

module.exports = { addNode };

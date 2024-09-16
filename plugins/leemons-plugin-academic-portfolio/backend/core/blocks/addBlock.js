const { validateAddBlock } = require('../../validations/forms');
const { subjectByIds } = require('../subjects/index');

// TODO PAOLA: En el modelo de session el block id y el valor del blockName: name.
async function addBlock({ data, ctx }) {
  await validateAddBlock({ data, ctx });

  const [subjectData] = await subjectByIds({ ids: [data.subject], ctx });

  const blockDoc = await ctx.tx.db.Blocks.create({ ...data, program: subjectData.program });
  return blockDoc.toObject();
}

module.exports = { addBlock };

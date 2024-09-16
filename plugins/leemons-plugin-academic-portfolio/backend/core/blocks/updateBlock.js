const { validateUpdateBlock } = require('../../validations/forms');

async function updateBlock({ data, ctx }) {
  await validateUpdateBlock({ data, ctx });
  const { id, ...updateData } = data;

  return ctx.tx.db.Blocks.findOneAndUpdate({ id }, updateData, { new: true, lean: true });
}

module.exports = { updateBlock };

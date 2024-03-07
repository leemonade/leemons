const _ = require('lodash');
const { validateUpdateNodeLevel } = require('../../validations/forms');

async function updateNodeLevel({ data, ctx }) {
  await validateUpdateNodeLevel({ data, ctx });
  return ctx.tx.db.NodeLevels.findOneAndUpdate({ id: data.id }, data, { lean: true, new: true });
}

module.exports = { updateNodeLevel };

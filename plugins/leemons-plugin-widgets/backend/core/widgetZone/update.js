const _ = require('lodash');
const { validatePrefix } = require('../validation/validate');

async function update({ key, name, description, ctx }) {
  validatePrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  const toUpdate = {};
  if (!_.isUndefined(name)) toUpdate.name = name;
  if (!_.isUndefined(description)) toUpdate.description = description;
  return ctx.tx.db.WidgetZone.findOneAndUpdate({ key }, toUpdate, { new: true });
}

module.exports = { update };

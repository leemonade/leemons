const { validatePrefix } = require('../validation/validate');

async function add({ key, name, description, ctx }) {
  validatePrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  return ctx.tx.db.WidgetZone.create({ key, name, description });
}

module.exports = { add };

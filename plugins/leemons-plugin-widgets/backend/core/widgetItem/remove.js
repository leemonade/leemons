const { validatePrefix } = require('../validation/validate');

async function remove({ zoneKey, key, ctx }) {
  validatePrefix({ type: key, calledFrom: ctx.callerPlugin, ctx });
  return ctx.tx.db.WidgetItem.deleteOne({ zoneKey, key });
}

module.exports = { remove };

const { validatePrefix } = require('../validation/validate');

async function add({ key, name, description, ctx }) {
  validatePrefix({ type: key, calledFrom: ctx.callerPlugin, ctx });
  const widgetZoneDoc = await ctx.tx.db.WidgetZone.create({ key, name, description });
  return widgetZoneDoc.toObject();
}

module.exports = { add };

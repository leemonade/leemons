const { validatePrefix } = require('../validation/validate');

async function add({ key, name, description, ctx }) {
  validatePrefix({ type: key, calledFrom: ctx.callerPlugin, ctx });
  const kk = ctx.tx.db.WidgetZone.create({ key, name, description });
  console.log('------------AÑADIENDO WIDGET ZONE---------', key);
  return kk;
}

module.exports = { add };

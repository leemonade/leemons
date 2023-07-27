const { validatePrefix } = require('../validation/validate');

async function remove({ key, ctx }) {
  validatePrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  // ES: NOTA: No borramos los items por si mas adelante se vuelve a añadir la misma zona
  // EN: NOTE: We don't delete the items because if we add it again later we will add it again
  return ctx.tx.db.WidgetZone.deleteOne({ key });
}

module.exports = { remove };

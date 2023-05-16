const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');

async function remove(key, { transacting } = {}) {
  validatePrefix(key, this.calledFrom);
  // ES: NOTA: No borramos los items por si mas adelante se vuelve a añadir la misma zona
  // EN: NOTE: We don't delete the items because if we add it again later we will add it again
  return table.widgetZone.delete({ key }, { transacting });
}

module.exports = { remove };

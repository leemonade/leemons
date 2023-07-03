const { table } = require('../tables');

async function onDisableUserAgents({ ids, transacting: _transacting }) {
  return global.utils.withTransaction(
    async (transacting) => {
      // Sacar user agent de sus clases
    },
    table.groups,
    _transacting
  );
}

module.exports = { onDisableUserAgents };

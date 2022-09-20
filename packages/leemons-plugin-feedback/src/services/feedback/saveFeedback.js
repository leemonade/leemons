const _ = require('lodash');
const { table } = require('../tables');

async function saveFeedback(data, { userSession, transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  return global.utils.withTransaction(
    async (transacting) => {
      console.log('Gatitos', userSession);
    },
    table.feedback,
    _transacting
  );
}

module.exports = saveFeedback;

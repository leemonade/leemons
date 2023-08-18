const _ = require('lodash');
const { table } = require('../tables');

async function addClick(id, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const config = await table.messageConfig.findOne(
        { id },
        { columns: ['totalClicks'], transacting }
      );
      if (!_.isNumber(config.totalClicks)) {
        config.totalClicks = 0;
      }
      return Promise.all([
        table.messageConfig.update(
          { id },
          { totalClicks: config.totalClicks + 1 },
          { transacting }
        ),
        table.messageConfigClicks.create(
          { messageConfig: id, userAgent: userSession.userAgents[0].id },
          { transacting }
        ),
      ]);
    },
    table.messageConfig,
    _transacting
  );
}

module.exports = { addClick };

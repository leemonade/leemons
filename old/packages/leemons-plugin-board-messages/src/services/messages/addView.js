const _ = require('lodash');
const { table } = require('../tables');

async function addView(id, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const config = await table.messageConfig.findOne(
        { id },
        { columns: ['totalViews'], transacting }
      );
      if (!_.isNumber(config.totalViews)) {
        config.totalViews = 0;
      }
      return Promise.all([
        table.messageConfig.update({ id }, { totalViews: config.totalViews + 1 }, { transacting }),
        table.messageConfigViews.create(
          { messageConfig: id, userAgent: userSession.userAgents[0].id },
          { transacting }
        ),
      ]);
    },
    table.messageConfig,
    _transacting
  );
}

module.exports = { addView };

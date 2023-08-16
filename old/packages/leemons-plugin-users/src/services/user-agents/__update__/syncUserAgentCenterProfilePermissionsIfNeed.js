const _ = require('lodash');
const { table } = require('../../tables');
const {
  addCenterProfilePermissionToUserAgents,
} = require('../addCenterProfilePermissionToUserAgents');

async function syncUserAgentCenterProfilePermissionsIfNeed(
  isInstalled,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (isInstalled) {
        const hasKey = await table.config.findOne(
          {
            key: '__syncUserAgentCenterProfilePermissionsIfNeed2__',
          },
          { transacting }
        );
        if (!hasKey) {
          console.log('---------- syncUserAgentCenterProfilePermissionsIfNeed');
          const userAgents = await table.userAgent.find({}, { columns: ['id'], transacting });

          await addCenterProfilePermissionToUserAgents(_.map(userAgents, 'id'), { transacting });

          await table.config.create(
            { key: '__syncUserAgentCenterProfilePermissionsIfNeed2__', value: 'true' },
            { transacting }
          );
        }
      } else {
        await table.config.create(
          { key: '__syncUserAgentCenterProfilePermissionsIfNeed2__', value: 'true' },
          { transacting }
        );
      }
    },
    table.config,
    _transacting
  );
}

module.exports = { syncUserAgentCenterProfilePermissionsIfNeed };

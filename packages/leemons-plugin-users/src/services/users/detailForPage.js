const _ = require('lodash');
const { table } = require('../tables');
const { getUserAgentsInfo } = require('../user-agents/getUserAgentsInfo');
const { getPreferences } = require('../user-preferences/getPreferences');

async function detailForPage(userId, { transacting } = {}) {
  const [user, preferences] = await Promise.all([
    table.users.findOne({ id: userId }, { transacting }),
    getPreferences(userId, { transacting }),
  ]);
  if (!user) throw new Error('User not found');
  const userAgentsIds = await table.userAgent.find(
    { user: user.id },
    { columns: ['id'], transacting }
  );
  const userAgents = await getUserAgentsInfo(_.map(userAgentsIds, 'id'), {
    withProfile: true,
    withCenter: true,
    transacting,
  });
  return {
    user: {
      ...user,
      preferences,
    },
    userAgents,
  };
}

module.exports = { detailForPage };

const _ = require('lodash');
const { table } = require('../tables');
const { getUserAgentsInfo } = require('../user-agents/getUserAgentsInfo');
const { getPreferences } = require('../user-preferences/getPreferences');
const { getUserDatasetInfo } = require('../user-agents/getUserDatasetInfo');

async function detailForPage(userId, { userSession, transacting } = {}) {
  const [user, preferences, dataset] = await Promise.all([
    table.users.findOne({ id: userId }, { transacting }),
    getPreferences(userId, { transacting }),
    getUserDatasetInfo(userId, { userSession, transacting }),
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
    dataset,
  };
}

module.exports = { detailForPage };

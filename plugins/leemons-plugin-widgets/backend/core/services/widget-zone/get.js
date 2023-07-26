const _ = require('lodash');
const { table } = require('../tables');

async function get(key, { userSession, transacting } = {}) {
  const [zone, items] = await Promise.all([
    table.widgetZone.findOne({ key }, { transacting }),
    table.widgetItem.find({ zoneKey: key }, { transacting }),
  ]);

  let widgetItems = _.orderBy(items, ['order'], ['asc']);

  if (userSession) {
    const [userAgents, itemProfiles] = await Promise.all([
      leemons
        .getPlugin('users')
        .services.users.getUserAgentsInfo(_.map(userSession.userAgents, 'id'), {
          withProfile: true,
          transacting,
        }),
      table.widgetItemProfile.find(
        {
          zoneKey: key,
        },
        { transacting }
      ),
    ]);
    const profiles = _.uniq(_.map(userAgents, (userAgent) => userAgent.profile?.id));
    const profilesByItemKey = {};
    _.forEach(itemProfiles, (itemProfile) => {
      if (!_.isArray(profilesByItemKey[itemProfile.key])) {
        profilesByItemKey[itemProfile.key] = [];
      }
      profilesByItemKey[itemProfile.key].push(itemProfile.profile);
    });

    widgetItems = _.filter(widgetItems, (widgetItem) => {
      if (!profilesByItemKey[widgetItem.key]) {
        return true;
      }
      return _.intersection(profiles, profilesByItemKey[widgetItem.key]).length > 0;
    });
  }

  return {
    ...zone,
    widgetItems: _.map(widgetItems, (widgetItem) => ({
      ...widgetItem,
      properties: JSON.parse(widgetItem.properties),
    })),
  };
}

module.exports = { get };

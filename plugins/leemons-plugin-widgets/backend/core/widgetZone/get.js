const _ = require('lodash');

async function get({ key, ctx }) {
  const { userSession } = ctx.meta;
  const [zone, items] = await Promise.all([
    ctx.tx.db.WidgetZone.findOne({ key }).lean(),
    ctx.tx.db.WidgetItem.find({ zoneKey: key }).lean(),
  ]);

  let widgetItems = _.orderBy(items, ['order'], ['asc']);

  if (userSession) {
    const [userAgents, itemProfiles] = await Promise.all([
      ctx.tx.call('users.users.getUserAgentsInfo', {
        userAgentIds: _.map(userSession.userAgents),
        userColumns: ['id'],
        withProfile: true,
      }),
      ctx.tx.db.WidgetItemProfile.find({
        zoneKey: key,
      }).lean(),
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

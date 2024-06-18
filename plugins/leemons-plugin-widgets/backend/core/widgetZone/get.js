const _ = require('lodash');

async function get({ key, ctx }) {
  const { userSession } = ctx.meta;

  const [zone, items, deploymentConfig] = await Promise.all([
    ctx.tx.db.WidgetZone.findOne({ key }).lean(),
    ctx.tx.db.WidgetItem.find({ zoneKey: key }).lean(),
    ctx.tx.call('deployment-manager.getConfigRest'),
  ]);

  const zonesDenied = _.get(deploymentConfig, 'deny.zone', []);

  if (_.includes(zonesDenied, zone.key)) {
    return zone;
  }

  const itemsDenied = _.get(deploymentConfig, 'deny.item', []);
  const itemsAllowed = items.filter(
    (item) => !_.includes(itemsDenied, item.key) && !_.includes(zonesDenied, item.zoneKey)
  );

  let widgetItems = _.orderBy(itemsAllowed, ['order'], ['asc']);

  if (userSession) {
    const [userAgents, itemProfiles] = await Promise.all([
      ctx.tx.call('users.users.getUserAgentsInfo', {
        userAgentIds: _.map(userSession.userAgents, 'id'),
        withProfile: true,
      }),
      ctx.tx.db.WidgetItemProfiles.find({
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
      properties: JSON.parse(widgetItem.properties || null),
    })),
  };
}

module.exports = { get };

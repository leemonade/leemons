const _ = require('lodash');

async function byIds({ ids: _ids, ctx }) {
  const ids = _.isArray(_ids) ? _ids : [_ids];
  const query = {};
  const query2 = {};
  if (ids[0] !== '*') {
    query.id = ids;
    query2.messageConfig = ids;
  }

  const [configs, centers, classes, profiles, programs] = await Promise.all([
    ctx.tx.db.MessageConfig.find(query).lean(),
    ctx.tx.db.MessageConfigCenters.find(query2).select(['messageConfig', 'center']).lean(),
    ctx.tx.db.MessageConfigClasses.find(query2).select(['messageConfig', 'class']).lean(),
    ctx.tx.db.MessageConfigProfiles.find(query2).select(['messageConfig', 'profile']).lean(),
    ctx.tx.db.MessageConfigPrograms.find(query2).select(['messageConfig', 'program']).lean(),
  ]);

  const updateToCompletePromises = [];
  const now = new Date();
  _.forEach(configs, (config, index) => {
    if (config.status === 'published' && now > config.endDate) {
      configs[index].status = 'completed';
      updateToCompletePromises.push(
        ctx.tx.db.MessageConfig.updateOne({ id: config.id }, { status: 'completed' })
      );
    }
  });

  if (updateToCompletePromises.length) {
    await Promise.all(updateToCompletePromises);
  }

  const ownerIds = _.uniq(_.map(configs, 'owner'));
  const assetIds = _.uniq(_.map(configs, 'asset'));

  const [owners, assets] = await Promise.all([
    ctx.tx.call('users.users.getUserAgentsInfo', { userAgentIds: ownerIds }),
    ctx.tx.call('leebrary.assets.getByIds', { ids: assetIds, withFiles: true }),
  ]);

  const assetsById = _.keyBy(assets, 'id');
  const ownersById = _.keyBy(owners, 'id');
  const centersByConfig = _.groupBy(centers, 'messageConfig');
  const classesByConfig = _.groupBy(classes, 'messageConfig');
  const profilesByConfig = _.groupBy(profiles, 'messageConfig');
  const programsByConfig = _.groupBy(programs, 'messageConfig');

  return _.map(configs, (config) => ({
    ...config,
    asset: assetsById[config.asset],
    owner: ownersById[config.owner],
    centers: centersByConfig[config.id] ? _.map(centersByConfig[config.id], 'center') : [],
    classes: classesByConfig[config.id] ? _.map(classesByConfig[config.id], 'class') : [],
    profiles: profilesByConfig[config.id] ? _.map(profilesByConfig[config.id], 'profile') : [],
    programs: programsByConfig[config.id] ? _.map(programsByConfig[config.id], 'program') : [],
  }));
}

module.exports = { byIds };

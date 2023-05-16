const _ = require('lodash');
const { table } = require('../tables');

async function byIds(_ids, { userSession, transacting } = {}) {
  const ids = _.isArray(_ids) ? _ids : [_ids];
  const query = {};
  const query2 = {};
  if (ids[0] !== '*') {
    query.id_$in = ids;
    query2.messageConfig_$in = ids;
  }

  const [configs, centers, classes, profiles, programs] = await Promise.all([
    table.messageConfig.find(query, { transacting }),
    table.messageConfigCenters.find(query2, { columns: ['messageConfig', 'center'], transacting }),
    table.messageConfigClasses.find(query2, { columns: ['messageConfig', 'class'], transacting }),
    table.messageConfigProfiles.find(query2, {
      columns: ['messageConfig', 'profile'],
      transacting,
    }),
    table.messageConfigPrograms.find(query2, {
      columns: ['messageConfig', 'program'],
      transacting,
    }),
  ]);

  const updateToCompletePromises = [];
  const now = new Date();
  _.forEach(configs, (config, index) => {
    if (config.status === 'published' && now > config.endDate) {
      configs[index].status = 'completed';
      updateToCompletePromises.push(
        table.messageConfig.update({ id: config.id }, { status: 'completed' }, { transacting })
      );
    }
  });

  if (updateToCompletePromises.length) {
    await Promise.all(updateToCompletePromises);
  }

  const ownerIds = _.uniq(_.map(configs, 'owner'));
  const assetIds = _.uniq(_.map(configs, 'asset'));

  const [owners, assets] = await Promise.all([
    leemons.getPlugin('users').services.users.getUserAgentsInfo(ownerIds, {
      transacting,
    }),
    leemons.getPlugin('leebrary').services.assets.getByIds(assetIds, {
      withFiles: true,
      userSession,
      transacting,
    }),
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

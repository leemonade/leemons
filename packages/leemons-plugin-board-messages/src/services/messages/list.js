const _ = require('lodash');
const { table } = require('../tables');
const { byIds } = require('./byIds');

async function list(page, size, { userSession, filters, transacting } = {}) {
  const query = {};
  if (filters) {
    let ids = null;
    if (filters.centers) {
      if (!ids) ids = [];
      const items = await table.messageConfigCenters.find(
        { center_$in: filters.centers },
        { columns: ['messageConfig'], transacting }
      );
      ids.push(..._.map(items, 'messageConfig'));
    }
    if (filters.programs) {
      if (!ids) ids = [];
      const items = await table.messageConfigPrograms.find(
        { program_$in: filters.programs },
        { columns: ['messageConfig'], transacting }
      );
      ids.push(..._.map(items, 'messageConfig'));
    }
    if (filters.profiles) {
      if (!ids) ids = [];
      const items = await table.messageConfigProfiles.find(
        { profile_$in: filters.profiles },
        { columns: ['messageConfig'], transacting }
      );
      ids.push(..._.map(items, 'messageConfig'));
    }
    if (filters.classes) {
      if (!ids) ids = [];
      const items = await table.messageConfigClasses.find(
        { class_$in: filters.classes },
        { columns: ['messageConfig'], transacting }
      );
      ids.push(..._.map(items, 'messageConfig'));
    }
    if (ids !== null) {
      query.id_$in = _.uniq(ids);
    }
    if (filters.zone) {
      query.zone_$in = _.isArray(filters.zone) ? filters.zone : [filters.zone];
    }
    if (filters.status) {
      query.status_$in = _.isArray(filters.status) ? filters.status : [filters.status];
    }
    if (filters.internalName) {
      query.internalName_$contains = filters.internalName;
    }
  }
  const results = await global.utils.paginate(table.messageConfig, page, size, query, {
    transacting,
    columns: ['id'],
  });

  results.items = await byIds(_.map(results.items, 'id'), { userSession, transacting });
  return results;
}

module.exports = { list };

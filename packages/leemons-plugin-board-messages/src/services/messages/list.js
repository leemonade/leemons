const _ = require('lodash');
const { table } = require('../tables');
const { byIds } = require('./byIds');

async function list(page, size, { userSession, filters, transacting } = {}) {
  const query = {};
  if (filters) {
    let ids = null;
    if (filters.centers) {
      const q = { center_$in: [...filters.centers, '*'] };
      if (ids !== null) {
        q.messageConfig_$in = ids;
      }
      const items = await table.messageConfigCenters.find(q, {
        columns: ['messageConfig'],
        transacting,
      });
      ids = _.map(items, 'messageConfig');
    }
    if (filters.programs) {
      const q = { program_$in: [...filters.programs, '*'] };
      if (ids !== null) {
        q.messageConfig_$in = ids;
      }
      const items = await table.messageConfigPrograms.find(q, {
        columns: ['messageConfig'],
        transacting,
      });
      ids = _.map(items, 'messageConfig');
    }
    if (filters.profiles) {
      const q = { profile_$in: [...filters.profiles, '*'] };
      if (ids !== null) {
        q.messageConfig_$in = ids;
      }
      const items = await table.messageConfigProfiles.find(q, {
        columns: ['messageConfig'],
        transacting,
      });
      ids = _.map(items, 'messageConfig');
    }
    if (filters.classes) {
      const q = { class_$in: [...filters.classes, '*'] };
      if (ids !== null) {
        q.messageConfig_$in = ids;
      }
      const items = await table.messageConfigClasses.find(q, {
        columns: ['messageConfig'],
        transacting,
      });
      ids = _.map(items, 'messageConfig');
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

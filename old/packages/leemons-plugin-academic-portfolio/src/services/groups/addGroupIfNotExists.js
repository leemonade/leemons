const { isEmpty } = require('lodash');
const { table } = require('../tables');
const { addGroup } = require('./addGroup');
const { listGroups } = require('./listGroups');

async function addGroupIfNotExists(group, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { id, abbreviation, program } = group || {};
      const query = { program };

      if (!isEmpty(id)) {
        query.id = id;
      } else if (!isEmpty(abbreviation)) {
        query.abbreviation = abbreviation;
      }

      if (!isEmpty(query)) {
        const groups = await listGroups(0, 99999, program, { query, transacting });

        if (groups.count > 0) {
          return groups.items[0];
        }
      }

      return addGroup(group, { transacting });
    },
    table.groups,
    _transacting
  );
}

module.exports = { addGroupIfNotExists };

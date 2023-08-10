const { isEmpty } = require('lodash');
const { addGroup } = require('./addGroup');
const { listGroups } = require('./listGroups');

async function addGroupIfNotExists({ group, ctx }) {
  const { id, abbreviation, program } = group || {};
  const query = { program };

  if (!isEmpty(id)) {
    query.id = id;
  } else if (!isEmpty(abbreviation)) {
    query.abbreviation = abbreviation;
  }

  if (!isEmpty(query)) {
    const groups = await listGroups({ page: 0, size: 99999, program, query, ctx });

    if (groups.count > 0) {
      return groups.items[0];
    }
  }

  return addGroup({ data: group, ctx });
}

module.exports = { addGroupIfNotExists };

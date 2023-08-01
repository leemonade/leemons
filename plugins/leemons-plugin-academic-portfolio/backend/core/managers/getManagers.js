/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { table } = require('../tables');

async function getManagers(relationships, { types, returnAgents = true, transacting } = {}) {
  if (relationships) {
    const _relationships = _.isArray(relationships) ? relationships : [relationships];
    const _types = types ? (_.isArray(types) ? types : [types]) : [];
    const query = {
      relationship_$in: _relationships,
    };
    if (_types && _types.length) {
      query.type_$in = _types;
    }
    const responses = await table.managers.find(query, { transacting });
    if (returnAgents) {
      return _.uniq(_.map(responses, 'userAgent'));
    }
    return responses;
  }
  return [];
}

module.exports = { getManagers };

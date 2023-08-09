/* eslint-disable no-nested-ternary */
const _ = require('lodash');

async function getManagers({ relationships, types, returnAgents = true, ctx }) {
  if (relationships) {
    const _relationships = _.isArray(relationships) ? relationships : [relationships];
    const _types = types ? (_.isArray(types) ? types : [types]) : [];
    const query = {
      relationship: _relationships,
    };
    if (_types && _types.length) {
      query.type_$in = _types;
    }
    const responses = await ctx.tx.db.Managers.find(query).lean();
    if (returnAgents) {
      return _.uniq(_.map(responses, 'userAgent'));
    }
    return responses;
  }
  return [];
}

module.exports = { getManagers };

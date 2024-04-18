const _ = require('lodash');

async function getProgramGroups({ ids, options = {}, ctx }) {
  return ctx.tx.db.Groups.find(
    { program: _.isArray(ids) ? ids : [ids], type: 'group' },
    '',
    options
  ).lean();
}

module.exports = { getProgramGroups };

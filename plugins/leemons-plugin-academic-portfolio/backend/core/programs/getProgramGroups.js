const _ = require('lodash');

async function getProgramGroups({ ids, ctx }) {
  return ctx.tx.db.Groups.find({ program: _.isArray(ids) ? ids : [ids], type: 'group' }).lean();
}

module.exports = { getProgramGroups };

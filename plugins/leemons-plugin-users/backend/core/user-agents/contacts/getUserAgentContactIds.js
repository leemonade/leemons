const _ = require('lodash');

async function getUserAgentContactIds({ fromUserAgent, ctx }) {
  const response = await ctx.tx.db.UserAgentContacts.find({
    fromUserAgent,
  })
    .select(['toUserAgent'])
    .lean();
  return _.uniq(_.map(response, 'toUserAgent'));
}

module.exports = { getUserAgentContactIds };

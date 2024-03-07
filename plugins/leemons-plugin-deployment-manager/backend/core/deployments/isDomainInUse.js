const _ = require('lodash');

async function isDomainInUse({ ctx, domain }) {
  const count = await ctx.db.deployment.countDocuments({
    domains: { $in: _.isArray(domain) ? domain : [domain] },
  });
  return !!count;
}

module.exports = { isDomainInUse };

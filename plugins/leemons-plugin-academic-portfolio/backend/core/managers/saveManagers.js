const _ = require('lodash');

async function saveManagers({ userAgents, type, relationship, ctx }) {
  await ctx.tx.db.Managers.deleteMany({ type, relationship });
  if (userAgents) {
    const _userAgents = _.isArray(userAgents) ? userAgents : [userAgents];
    const promises = [];
    _.forEach(_userAgents, (userAgent) => {
      promises.push(
        ctx.tx.db.Managers.create({
          relationship,
          type,
          userAgent,
        })
      );
    });
    return Promise.all(promises);
  }
  return [];
}

module.exports = { saveManagers };

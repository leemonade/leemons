const _ = require('lodash');

async function saveManagers({ userAgents, type, relationship, ctx }) {
  await ctx.tx.db.Managers.deleteMany({ type, relationship });
  if (userAgents) {
    const _userAgents = _.isArray(userAgents) ? userAgents : [userAgents];
    const promises = [];
    _.forEach(_userAgents, async (userAgent) => {
      promises.push(
        ctx.tx.db.Managers.create({
          relationship,
          type,
          userAgent,
        }).then((mongooseDoc) => mongooseDoc.toObject()) // Convert Mongoose document to regular object here
      );
    });
    return Promise.all(promises);
  }
  return [];
}

module.exports = { saveManagers };

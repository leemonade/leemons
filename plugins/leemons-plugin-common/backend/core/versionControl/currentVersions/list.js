const { LeemonsError } = require('leemons-error');
const stringifyType = require('../helpers/type/stringifyType');
const verifyOwnership = require('../helpers/type/verifyOwnership');

module.exports = async function list({ type, published, ctx }) {
  const parsedType = stringifyType({ calledFrom: ctx.callerPlugin, type, ctx });

  if (!verifyOwnership({ type: parsedType, ctx })) {
    throw new LeemonsError(ctx, {
      message: "You don't have permissions to list versions of the given type or it doesn't exists",
    });
  }

  const query = {
    type: parsedType,
  };

  if (typeof published === 'boolean') {
    query.published = published ? { $ne: null } : null;
  }

  const results = await ctx.tx.db.CurrentVersions.find(query).lean();

  return results.map((r) => ({
    uuid: r.id,
    current: r.published,
    type: r.type,
  }));
};

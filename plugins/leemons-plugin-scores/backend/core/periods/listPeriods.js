const { map } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

module.exports = async function listPeriods({ sort, page, size, ctx, ...query }) {
  const { userSession } = ctx.meta;
  const q = {
    ...query,
  };

  if (q.public === false) {
    q.createdBy = map(userSession.userAgents, 'id');
  } else {
    q.$or = [{ public: true }, { createdBy: map(userSession.userAgents, 'id') }];
  }

  try {
    return await mongoDBPaginate({
      model: ctx.tx.db.Periods,
      page,
      size,
      query: q,
      sort,
    });
  } catch (e) {
    throw new LeemonsError(ctx, { message: `Error listing periods ${e.message}` });
  }
};

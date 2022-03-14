const { search } = require('../src/services/search');

async function searchAssets(ctx) {
  const { details, ...query } = ctx.request.query;
  const { userSession } = ctx.state;

  const assets = await search(query, { details: details !== 'false', userSession });
  ctx.status = 200;
  ctx.body = { status: 200, assets };
}
module.exports = {
  search: searchAssets,
};

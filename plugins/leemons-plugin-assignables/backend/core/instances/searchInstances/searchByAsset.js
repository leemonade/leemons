const { map, uniq, flattenDeep } = require('lodash');

async function searchByAsset({ assignablesByAssignableInstance, query, ctx }) {
  if (!query.search) {
    return null;
  }

  const roles = map(assignablesByAssignableInstance, 'role');

  const searchResult = await Promise.all(
    roles.map((role) =>
      ctx.tx.call('leebrary.search.search', {
        criteria: query.search,
        category: `assignables.${role}`,
        allVersions: true,
        published: true,
      })
    )
  );

  const matchingAssets = flattenDeep(searchResult);

  return uniq(map(matchingAssets, 'asset'));
}

module.exports = {
  searchByAsset,
};

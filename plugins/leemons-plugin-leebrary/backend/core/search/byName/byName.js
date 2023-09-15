const { isEmpty } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

async function byName({ name, details = false, indexable = true, assets: assetsIds, ctx }) {
  try {
    const query = {
      name: { $regex: name },
      indexable,
    };

    if (!isEmpty(assetsIds)) {
      query.id = assetsIds;
    }

    let assets = await ctx.tx.db.Assets.find(query).select('id').lean();
    assets = assets.map((entry) => entry.id);

    if (details) {
      return getAssetsByIds({ ids: assets, ctx });
    }

    return assets;
  } catch (e) {
    throw LeemonsError(ctx, {
      message: `Failed to find asset with name: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byName };

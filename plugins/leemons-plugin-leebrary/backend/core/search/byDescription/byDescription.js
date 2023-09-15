const { isEmpty } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

async function byDescription({
  description,
  details = false,
  indexable = true,
  assets: assetsIds,
  ctx,
}) {
  try {
    const query = {
      description: { $regex: description },
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
    throw new LeemonsError(ctx, {
      message: `Failed to find asset with description: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byDescription };

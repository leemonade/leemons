const { isEmpty, escapeRegExp } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

async function byTagline({ tagline, details = false, indexable = true, assets: assetsIds, ctx }) {
  try {
    const query = {
      tagline: { $regex: escapeRegExp(tagline), $options: 'i' },
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
      message: `Failed to find asset with tagline: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byTagline };

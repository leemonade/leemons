const { LeemonsError } = require('leemons-error');

const { getByAsset } = require('../getByAsset');

async function removeByAsset({ assetId, soft, ctx }) {
  const pin = await getByAsset({ assetId, ctx });

  if (!pin) {
    throw new LeemonsError(ctx, { message: 'Pin not found', httpStatusCode: 404 });
  }

  try {
    return await ctx.tx.db.Pins.deleteOne({ id: pin.id }, { soft });
  } catch (e) {
    throw new LeemonsError(ctx, { message: 'Failed to remove Pin', httpStatusCode: 500 });
  }
}

module.exports = { removeByAsset };

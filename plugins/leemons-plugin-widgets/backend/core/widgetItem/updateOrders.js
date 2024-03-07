const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateUpdateItemOrders } = require('../validation/forms');

async function updateOrders({ items, ctx }) {
  validateUpdateItemOrders(items);
  const count = await ctx.tx.db.WidgetItem.countDocuments({
    id: _.map(items, 'id'),
  });
  if (count !== items.length) {
    throw new LeemonsError(ctx, { message: 'Some items do not exist' });
  }
  return Promise.all(
    _.map(items, (item) =>
      ctx.tx.db.WidgetItem.findOneAndUpdate(
        { id: item.id },
        { order: item.order },
        { new: true, lean: true }
      )
    )
  );
}

module.exports = { updateOrders };

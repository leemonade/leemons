const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateItemOrders } = require('../../validation/forms');

async function updateOrders(items, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateUpdateItemOrders(items);
      const count = await table.widgetItem.count(
        {
          id_$in: _.map(items, 'id'),
        },
        { transacting }
      );
      if (count !== items.length) {
        throw new Error('Some items do not exist');
      }
      return Promise.all(
        _.map(items, (item) =>
          table.widgetItem.update({ id: item.id }, { order: item.order }, { transacting })
        )
      );
    },
    table.widgetItem,
    _transacting
  );
}

module.exports = { updateOrders };

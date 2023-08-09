/* eslint-disable no-param-reassign */
const { LeemonsError } = require('leemons-error');
const { isEmpty } = require('lodash');
const update = require('./update');
const { menuItems } = require('../../config/constants');

async function enableItem({ key, item, ctx }) {
  try {
    if (isEmpty(item)) {
      const menuItem = menuItems.find(({ item: _item }) => _item.key === key);
      item = menuItem?.item;
    }

    if (!isEmpty(item)) {
      return update({
        ...item,
        disabled: false,
        ctx,
      });
    }

    return null;
  } catch (e) {
    throw new LeemonsError(ctx, { message: `No menuItem with the key ${key} was found` });
  }
}

module.exports = enableItem;

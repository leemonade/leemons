const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

/**
 * Reorder user custom menu items
 * @private
 * @static
 * @param {string} menuKey Menu key
 * @param {string} parentKey Parent key
 * @param {string[]} ids Menu item ids in order
 * @param {UserSession} userSession User session
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function reOrderCustomUserItems({ menuKey, parentKey, ids, ctx }) {
  // Check if use have access to all menu item ids
  const count = await ctx.tx.db.MenuItem.countDocuments({
    menuKey,
    parentKey,
    id: ids,
    key: {
      $regex: new RegExp(`^${ctx.prefixPN(`user.${ctx.meta.userSession.id}.`)}`),
    },
  });
  if (count !== ids.length)
    throw new LeemonsError('The user does not have access to any of the following items');

  return Promise.all(
    _.map(ids, (id, order) => ctx.tx.db.MenuItem.findOneAndUpdate({ id }, { order }, { new: true }))
  );
}

module.exports = reOrderCustomUserItems;

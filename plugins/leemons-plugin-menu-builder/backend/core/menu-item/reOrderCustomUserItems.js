const _ = require('lodash');
const { table } = require('../../tables');

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
async function reOrderCustomUserItems(
  menuKey,
  parentKey,
  ids,
  userSession,
  { transacting: _transacting } = {}
) {
  // Check if use have access to all menu item ids
  const count = await table.menuItem.count(
    {
      menuKey,
      parentKey,
      id_$in: ids,
      key_$startssWith: leemons.plugin.prefixPN(`user.${userSession.id}.`),
    },
    { transacting: _transacting }
  );
  if (count !== ids.length)
    throw new Error('The user does not have access to any of the following items');

  return global.utils.withTransaction(
    async (transacting) =>
      Promise.all(
        _.map(ids, (id, order) => table.menuItem.update({ id }, { order }, { transacting }))
      ),
    table.menuItem,
    _transacting
  );
}

module.exports = reOrderCustomUserItems;

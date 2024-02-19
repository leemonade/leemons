const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateNotExistMenu, validateNotExistMenuItem } = require('../../validations/exists');

/**
 * Remove custom Menu Item
 * @private
 * @static
 * @param {UserSession} userSession User session
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function removeCustomForUser({ menuKey, key, ctx }) {
  if (!key.startsWith(ctx.prefixPN(`user.${ctx.meta.userSession.id}.`))) {
    throw new LeemonsError(ctx, { message: 'You can only delete your own custom items' });
  }

  // Check for required params
  await validateNotExistMenu({ key: menuKey, ctx });

  // Check if the MENU ITEM exists
  await validateNotExistMenuItem({ menuKey, key, ctx });

  // Remove the MENU ITEM
  const promises = [ctx.tx.db.MenuItem.deleteOne({ menuKey, key })];

  // Remove LABEL & DESCRIPTIONS in locales
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteKeyStartsWith', {
      key: ctx.prefixPN(`${menuKey}.${key}`),
    })
  );

  // Remove permissions for item
  promises.push(
    ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: ctx.prefixPN(`${menuKey}.menu-item.custom`),
        item: key,
      },
    })
  );

  // Remove de custom permission
  promises.push(
    ctx.tx.call('users.users.removeCustomUserAgentPermission', {
      userAgentId: _.map(ctx.meta.userSession.userAgents, 'id'),
      data: {
        permissionName: key,
      },
    })
  );

  await Promise.all(promises);

  ctx.logger.debug(`Remove custom menu item "${key}" from menu "${menuKey}"`);

  return true;
}

module.exports = { removeCustomForUser };

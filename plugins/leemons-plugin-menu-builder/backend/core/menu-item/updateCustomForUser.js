const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateNotExistMenu, validateNotExistMenuItem } = require('../../validations/exists');

/**
 * Update custom Menu Item
 * @private
 * @static
 * @param {UserSession} userSession User session
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {object} json - The item data to update
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function updateCustomForUser({ menuKey, key, label, description, ctx, ...data }) {
  if (!key.startsWith(ctx.prefixPN(`user.${ctx.meta.userSession.id}.`))) {
    throw new LeemonsError('You can only update your own custom items');
  }

  // Check for required params
  await validateNotExistMenu({ key: menuKey, ctx });

  // Check if the MENU ITEM exists
  await validateNotExistMenuItem({ menuKey, key, ctx });

  // Update the MENU ITEM
  const promises = [];

  if (!_.isEmpty(data)) {
    promises.push(
      ctx.tx.db.MenuItem.findOneAndUpdate({ menuKey, key }, data, { new: true, lean: true })
    );
  }

  // Update LABEL & DESCRIPTIONS in locales
  if (label) {
    promises.push(
      ctx.tx.call('multilanguage.contents.setValue', {
        key: ctx.prefixPN(`${menuKey}.${key}.label`),
        locale: ctx.meta.userSession.locale,
        value: label,
      })
    );
  }

  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.setValue', {
        key: ctx.prefixPN(`${menuKey}.${key}.description`),
        locale: ctx.meta.userSession.locale,
        value: description,
      })
    );
  }

  await Promise.all(promises);

  ctx.logger.debug(`Updated custom menu item "${key}" from menu "${menuKey}"`);

  return true;
}

module.exports = { updateCustomForUser };

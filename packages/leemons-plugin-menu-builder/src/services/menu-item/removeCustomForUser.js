const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const prefixPN = require('../../helpers/prefixPN');
const addItemPermissions = require('../../helpers/addItemPermissions');
const removeItemPermissions = require('../../helpers/removeItemPermissions');
const {
  validateExistMenuItem,
  validateNotExistMenu,
  validateNotExistMenuItem,
} = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Remove custom Menu Item
 * @private
 * @static
 * @param {any} userAuth User auth
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function removeCustomForUser(userAuth, menuKey, key, { transacting: _transacting } = {}) {
  const locales = translations();

  // TODO Hablar si esto es sufientemente seguro o si comprobamos mediante permisos el comprobar si puede borrar el registro (Es mas costoso)
  if (!key.startsWith(prefixPN(`user:${userAuth.id}.`))) {
    throw new Error('You can only delete your own custom items');
  }

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateNotExistMenuItem(menuKey, key, { transacting });

      // Remove the MENU ITEM
      const promises = [table.menuItem.delete({ menuKey, key }, { transacting })];

      // Remove LABEL & DESCRIPTIONS in locales
      if (locales) {
        promises.push(
          locales.contents.deleteKeyStartsWith(prefixPN(`${menuKey}.${key}.`), { transacting })
        );
      }

      // Remove permissions for item
      promises.push(removeItemPermissions(key, `${menuKey}.menu-item.custom`, { transacting }));

      // Remove de custom permission
      promises.push(
        leemons.plugins.users.services.users.removeCustomPermission(
          userAuth.id,
          {
            permissionName: key,
          },
          { transacting }
        )
      );

      await Promise.all(promises);

      leemons.log.info(`Remove custom menu item "${key}" from menu "${menuKey}"`);

      return true;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = removeCustomForUser;

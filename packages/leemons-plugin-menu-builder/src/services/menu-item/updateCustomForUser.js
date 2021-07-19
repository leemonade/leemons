const { table } = require('../../tables');
const { translations } = require('../../translations');
const prefixPN = require('../../helpers/prefixPN');
const removeItemPermissions = require('../../helpers/removeItemPermissions');
const { validateNotExistMenu, validateNotExistMenuItem } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Update custom Menu Item
 * @private
 * @static
 * @param {any} userAuth User auth
 * @param {string} menuKey - The Menu key
 * @param {string} key - The item key
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function updateCustomForUser(
  userAuth,
  menuKey,
  key,
  { label, description, ...data },
  { transacting: _transacting } = {}
) {
  const locales = translations();

  // TODO TERMINAR DE PROGRAMAR

  if (!key.startsWith(prefixPN(`user:${userAuth.id}.`))) {
    throw new Error('You can only update your own custom items');
  }

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateNotExistMenuItem(menuKey, key, { transacting });

      // Update the MENU ITEM
      const promises = [table.menuItem.update({ menuKey, key }, data, { transacting })];

      // Update LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.setValue(
              prefixPN(`${menuKey}.${key}.label`),
              userAuth.language,
              label,
              {
                transacting,
              }
            )
          );
        }

        if (description) {
          promises.push(
            locales.contents.setValue(
              prefixPN(`${menuKey}.${key}.description`),
              userAuth.language,
              description,
              {
                transacting,
              }
            )
          );
        }
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

module.exports = updateCustomForUser;

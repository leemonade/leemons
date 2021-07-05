const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const prefixPN = require('../../helpers/prefixPN');
const addItemPermissions = require('../../helpers/addItemPermissions');
const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');
const { validateExistMenuItem } = require('../../validations/exists');
const { validateAddMenuItem } = require('../../validations/menu-item');
const { validateNotExistMenu } = require('../../validations/exists');

const { withTransaction } = global.utils;

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {MenuPermissionsAdd=} permissions Permissions for Menu Item
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function add(
  { menuKey, key, parentKey, order, fixed, url, window, iconName, iconSvg, label, description },
  permissions,
  { transacting: _transacting } = {}
) {
  validateKeyPrefix(key, this.calledFrom);
  validateAddMenuItem({
    menuKey,
    key,
    parentKey,
    pluginName: this.calledFrom,
    order,
    fixed,
    url,
    window,
    iconName,
    iconSvg,
    label,
    description,
  });
  const locales = translations();

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateExistMenuItem(menuKey, key, { transacting });

      // Check if the MENU ITEM PARENT exists
      if (parentKey) {
        await validateNotExistMenuItem(menuKey, parentKey, { transacting });
      }

      // Create the MENU ITEM
      const promises = [
        table.menuItem.create(
          {
            menuKey,
            key,
            parentKey,
            pluginName: this.calledFrom,
            order,
            fixed,
            url,
            window,
            iconName,
            iconSvg,
          },
          { transacting }
        ),
      ];

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        promises.push(
          locales.contents.addManyByKey(prefixPN(`${menuKey}.${key}.label`), label, {
            transacting,
          })
        );

        if (description) {
          promises.push(
            locales.contents.addManyByKey(prefixPN(`${menuKey}.${key}.description`), description, {
              transacting,
            })
          );
        }
      }

      // Add the necessary permissions to view the item
      if (_.isArray(permissions) && permissions.length) {
        promises.push(
          addItemPermissions(key, `${menuKey}.menu-item`, permissions, { transacting })
        );
      }

      const [menuItem] = await Promise.all(promises);

      leemons.log.info(`Added menu item "${key}" to menu "${menuKey}"`);

      return menuItem;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = add;

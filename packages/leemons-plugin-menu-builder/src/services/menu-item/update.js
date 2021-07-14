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
 * @param {string} menuKey - Menu key
 * @param {string} key - Menu item key
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {MenuPermissionsAdd=} permissions Permissions for Menu Item
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function update(
  menuKey,
  key,
  { label, description, ...data },
  permissions,
  { transacting: _transacting } = {}
) {
  const _order = data.order;
  const _fixed = data.fixed;
  const _disabled = data.disabled;

  // eslint-disable-next-line no-param-reassign
  data.order = null;
  // eslint-disable-next-line no-param-reassign
  data.fixed = null;
  // eslint-disable-next-line no-param-reassign
  data.disabled = null;

  validateKeyPrefix(key, this.calledFrom);
  validateAddMenuItem({
    ...data,
    menuKey,
    key,
  });
  const locales = translations();

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateNotExistMenuItem(menuKey, key, { transacting });

      // Check if the MENU ITEM PARENT exists
      if (data.parentKey) {
        await validateNotExistMenuItem(menuKey, data.parentKey, { transacting });
        if (data.parentKey.startsWith(this.calledFrom)) {
          // eslint-disable-next-line no-param-reassign
          data.order = _order;
          // eslint-disable-next-line no-param-reassign
          data.fixed = _fixed;
          // eslint-disable-next-line no-param-reassign
          data.disabled = _disabled;
        }
      }

      // eslint-disable-next-line no-param-reassign
      data.pluginName = this.calledFrom;

      // Create the MENU ITEM
      const promises = [table.menuItem.update({ menuKey, key }, data, { transacting })];

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.addManyByKey(prefixPN(`${menuKey}.${key}.label`), label, {
              transacting,
            })
          );
        }

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
      } else if (leemons.plugins.users) {
        promises.push(
          addItemPermissions(
            key,
            `${menuKey}.menu-item`,
            [
              {
                permissionName:
                  leemons.plugins.users.config.constants.basicPermission.permissionName,
                actionNames: [leemons.plugins.users.config.constants.basicPermission.actionName],
              },
            ],
            { isCustomPermission: true, transacting }
          )
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

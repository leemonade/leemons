const _ = require('lodash');
const { table } = require('../../tables');
const { translations } = require('../../translations');
const addItemPermissions = require('../../helpers/addItemPermissions');
const removeItemPermissions = require('../../helpers/removeItemPermissions');
const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');
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
  data.order = undefined;
  // eslint-disable-next-line no-param-reassign
  data.fixed = undefined;
  // eslint-disable-next-line no-param-reassign
  data.disabled = undefined;

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

      // ES: Si la clave o el menu quieren ser actualizados tenemos que borrar de la tabla de traducciones y de permisos los registros, ya que dejan de existir
      if ((data.key && data.key !== key) || (data.menuKey && data.menuKey !== menuKey)) {
        if (locales) {
          promises.push(
            locales.contents.deleteKeyStartsWith(leemons.plugin.prefixPN(`${menuKey}.${key}.`)),
            {
              transacting,
            }
          );
        }
        promises.push(removeItemPermissions(key, `${menuKey}.menu-item`, { transacting }));
      }

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        if (label) {
          promises.push(
            locales.contents.setKey(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.label`),
              label,
              {
                transacting,
              }
            )
          );
        }

        if (description) {
          promises.push(
            locales.contents.setKey(
              leemons.plugin.prefixPN(`${data.menuKey}.${data.key}.description`),
              description,
              {
                transacting,
              }
            )
          );
        }
      }

      // Add the necessary permissions to view the item
      if (_.isArray(permissions) && permissions.length) {
        promises.push(removeItemPermissions(key, `${menuKey}.menu-item`, { transacting }));
        promises.push(
          addItemPermissions(data.key, `${data.menuKey}.menu-item`, permissions, { transacting })
        );
      } else if (leemons.plugins.users) {
        promises.push(
          addItemPermissions(
            data.key,
            `${data.menuKey}.menu-item`,
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

      leemons.log.info(
        `Updated menu item "${key}" of menu "${menuKey}" to "${data.key}" of menu "${aya.menuKey}"`
      );

      return menuItem;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = update;

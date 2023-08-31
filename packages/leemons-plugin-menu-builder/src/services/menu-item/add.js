const _ = require('lodash');
const { CORE_PLUGINS } = require('../../../config/constants');
const { table } = require('../../tables');
const { translations } = require('../../translations');
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
  {
    menuKey,
    key,
    parentKey,
    order,
    fixed,
    url,
    window,
    iconName,
    activeIconName,
    iconSvg,
    activeIconSvg,
    iconAlt,
    label,
    description,
    disabled,
  },
  permissions,
  { isCustomPermission, transacting: _transacting } = {}
) {
  const _order = order;
  const _fixed = fixed;
  const _disabled = disabled;

  // eslint-disable-next-line no-param-reassign
  order = undefined;
  // eslint-disable-next-line no-param-reassign
  fixed = undefined;
  // eslint-disable-next-line no-param-reassign
  disabled = undefined;

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
    activeIconName,
    iconSvg,
    activeIconSvg,
    iconAlt,
    label,
    description,
    disabled,
  });

  const locales = translations();

  return withTransaction(
    async (transacting) => {
      // Check for required params
      await validateNotExistMenu(menuKey, { transacting });

      // Check if the MENU ITEM exists
      await validateExistMenuItem(menuKey, key, { transacting });

      // TODO: This CORE_PLUGIN Array must come from leemons core
      if (CORE_PLUGINS.includes(this.calledFrom)) {
        // eslint-disable-next-line no-param-reassign
        order = _order;
      }

      // Check if the MENU ITEM PARENT exists
      if (parentKey) {
        await validateNotExistMenuItem(menuKey, parentKey, { transacting });
        if (parentKey.startsWith(this.calledFrom)) {
          // eslint-disable-next-line no-param-reassign
          order = _order;
          // eslint-disable-next-line no-param-reassign
          fixed = _fixed;
          // eslint-disable-next-line no-param-reassign
          disabled = _disabled;
        }
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
            activeIconName,
            iconSvg,
            activeIconSvg,
            iconAlt,
            disabled,
          },
          { transacting }
        ),
      ];

      // Create LABEL & DESCRIPTIONS in locales
      if (locales) {
        promises.push(
          locales.contents.addManyByKey(leemons.plugin.prefixPN(`${menuKey}.${key}.label`), label, {
            transacting,
          })
        );

        if (description) {
          promises.push(
            locales.contents.addManyByKey(
              leemons.plugin.prefixPN(`${menuKey}.${key}.description`),
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
        promises.push(
          leemons
            .getPlugin('users')
            .services.permissions.addItem(
              key,
              leemons.plugin.prefixPN(`${menuKey}.menu-item`),
              permissions,
              { isCustomPermission, transacting }
            )
        );
      } else if (leemons.getPlugin('users')) {
        promises.push(
          leemons
            .getPlugin('users')
            .services.permissions.addItemBasicIfNeed(
              key,
              leemons.plugin.prefixPN(`${menuKey}.menu-item`)
            )
        );
      }

      const [menuItem] = await Promise.all(promises);

      return menuItem;
    },
    table.menuItem,
    _transacting
  );
}

module.exports = add;

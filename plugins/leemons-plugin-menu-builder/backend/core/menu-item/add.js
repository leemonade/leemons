const _ = require('lodash');
const { CORE_PLUGINS } = require('../../config/constants');
const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');
const { validateExistMenuItem } = require('../../validations/exists');
const { validateAddMenuItem } = require('../../validations/menu-item');
const { validateNotExistMenu } = require('../../validations/exists');

/**
 * Create a Menu Item
 * @private
 * @static
 * @param {MenuItemAdd} data - The Menu Item to create
 * @param {MenuPermissionsAdd=} permissions Permissions for Menu Item
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function add({
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
  permissions,
  isCustomPermission,
  ctx,
}) {
  const _order = order;
  const _fixed = fixed;
  const _disabled = disabled;

  // eslint-disable-next-line no-param-reassign
  order = undefined;
  // eslint-disable-next-line no-param-reassign
  fixed = undefined;
  // eslint-disable-next-line no-param-reassign
  disabled = undefined;

  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  validateAddMenuItem({
    menuKey,
    key,
    parentKey,
    pluginName: ctx.callerPlugin,
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

  try {
    // Check for required params
    await validateNotExistMenu({ key: menuKey, ctx });
  } catch (e) {
    console.log('key', key);
    throw e;
  }

  // Check if the MENU ITEM exists
  await validateExistMenuItem({ menuKey, key, ctx });

  // TODO: This CORE_PLUGIN Array must come from leemons core
  if (CORE_PLUGINS.includes(ctx.callerPlugin)) {
    // eslint-disable-next-line no-param-reassign
    order = _order;
  }

  // Check if the MENU ITEM PARENT exists
  if (parentKey) {
    await validateNotExistMenuItem({ menuKey, key: parentKey, ctx });
    if (parentKey.startsWith(ctx.callerPlugin)) {
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
    ctx.tx.db.MenuItem.create({
      menuKey,
      key,
      parentKey,
      pluginName: ctx.callerPlugin,
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
    }),
  ];

  // Create LABEL & DESCRIPTIONS in locales
  promises.push(
    ctx.tx.call('multilanguage.contents.addManyByKey', {
      key: ctx.prefixPN(`${menuKey}.${key}.label`),
      data: label,
    })
  );

  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.addManyByKey', {
        key: ctx.prefixPN(`${menuKey}.${key}.description`),
        data: description,
      })
    );
  }

  // Add the necessary permissions to view the item
  if (_.isArray(permissions) && permissions.length) {
    promises.push(
      ctx.tx.call('users.permissions.addItem', {
        item: key,
        type: ctx.prefixPN(`${menuKey}.menu-item`),
        data: permissions,
        isCustomPermission,
      })
    );
  } else {
    promises.push(
      ctx.tx.call('users.permissions.addItemBasicIfNeed', {
        item: key,
        type: ctx.prefixPN(`${menuKey}.menu-item`),
      })
    );
  }

  const [menuItem] = await Promise.all(promises);

  return menuItem;
}

module.exports = { add };

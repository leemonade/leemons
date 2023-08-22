const _ = require('lodash');
const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');
const { validateUpdateMenuItem } = require('../../validations/menu-item');
const { validateNotExistMenu } = require('../../validations/exists');

/**
 * Update a Menu Item
 * @private
 * @static
 * @param {string} menuKey - Menu key
 * @param {string} key - Menu item key
 * @param {MenuItemAdd} data - The Menu Item to update
 * @param {MenuPermissionsAdd=} permissions Permissions for Menu Item
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function update({ menuKey, key, label, description, permissions, ctx, ...data }) {
  const _order = data.order;
  const _fixed = data.fixed;
  const _disabled = data.disabled;

  // eslint-disable-next-line no-param-reassign
  data.order = undefined;
  // eslint-disable-next-line no-param-reassign
  data.fixed = undefined;
  // eslint-disable-next-line no-param-reassign
  data.disabled = undefined;

  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  validateUpdateMenuItem({
    ...data,
    label,
    description,
    menuKey,
    key,
  });

  // Check for required params
  await validateNotExistMenu({ key: menuKey, ctx });

  // Check if the MENU ITEM exists
  await validateNotExistMenuItem({ menuKey, key, ctx });

  // Check if the MENU ITEM PARENT exists
  if (data.parentKey) {
    await validateNotExistMenuItem({ menuKey, key: data.parentKey, ctx });
    if (data.parentKey.startsWith(ctx.callerPlugin)) {
      // eslint-disable-next-line no-param-reassign
      data.order = _order;
      // eslint-disable-next-line no-param-reassign
      data.fixed = _fixed;
      // eslint-disable-next-line no-param-reassign
      data.disabled = _disabled;
    }
  }

  // console.log('MenuItem > update > this.calledFrom:', this.calledFrom);
  // console.log('MenuItem > update > data.pluginName:', data.pluginName);

  // eslint-disable-next-line no-param-reassign
  data.pluginName = ctx.callerPlugin;

  // Create the MENU ITEM
  const promises = [
    ctx.tx.db.MenuItem.findOneAndUpdate({ menuKey, key }, data, { new: true, lean: true }),
  ];

  // ES: Si la clave o el menu quieren ser actualizados tenemos que borrar de la tabla de traducciones y de permisos los registros, ya que dejan de existir
  if ((data.key && data.key !== key) || (data.menuKey && data.menuKey !== menuKey)) {
    promises.push(
      ctx.tx.call('multilanguage.contents.deleteKeyStartsWith', {
        key: ctx.prefixPN(`${menuKey}.${key}.`),
      })
    );
    promises.push(
      ctx.tx.call('users.permissions.removeItems', {
        query: {
          type: ctx.prefixPN(`${menuKey}.menu-item`),
          item: key,
        },
      })
    );
  }

  // Create LABEL & DESCRIPTIONS in locales
  if (label) {
    promises.push(
      ctx.tx.call('multilanguage.contents.setKey', {
        key: ctx.prefixPN(`${data.menuKey}.${data.key}.label`),
        data: label,
      })
    );
  }

  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.setKey', {
        key: ctx.prefixPN(`${data.menuKey}.${data.key}.description`),
        data: description,
      })
    );
  }

  // Add the necessary permissions to view the item
  if (_.isArray(permissions)) {
    await ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: ctx.prefixPN(`${menuKey}.menu-item`),
        item: key,
      },
    });

    if (permissions.length) {
      await ctx.tx.call('users.permissions.addItem', {
        item: data.key,
        type: ctx.prefixPN(`${data.menuKey}.menu-item`),
        data: permissions,
      });
    }
  }

  promises.push(
    await ctx.tx.call('users.permissions.addItemBasicIfNeed', {
      item: data.key,
      type: ctx.prefixPN(`${data.menuKey}.menu-item`),
    })
  );

  const [menuItem] = await Promise.all(promises);

  ctx.logger.info(
    `Updated menu item "${key}" of menu "${menuKey}" to "${data.key}" of menu "${data.menuKey}"`
  );

  return menuItem;
}

module.exports = { update };

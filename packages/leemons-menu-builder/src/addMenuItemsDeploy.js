const { hasKey, setKey } = require('@leemons/mongodb-helpers');
const _ = require('lodash');

/**
 * @typedef {import('@leemons/deployment-manager').Context} Context
 */

/**
 * Manages the addition or removal of menu items based on configurations and current state.
 *
 * @param {Object} params - Input parameters.
 * @param {Object} params.keyValueModel - Model for interacting with key-value storage.
 * @param {Object} params.item - Menu item object including `item`, `permissions`, `removed`, `isCustomPermission`.
 * @param {string} params.menuKey - Key of the menu to which the item belongs.
 * @param {Context} params.ctx - Context for making calls and emitting events.
 *
 * - Checks if the item should be removed based on `removed` and configuration.
 * - If it does not exist or a reload is forced, decides whether to add or remove the item.
 * - Updates the key-value system and emits an event to initialize the item.
 */
async function exec({
  keyValueModel,
  item: { item, permissions, removed, isCustomPermission },
  menuKey,
  ctx,
}) {
  // Check if the item has a key in the key-value storage
  const itemHasKey = await hasKey(keyValueModel, `menu-item-${menuKey}-${item.key}`);

  // Process the addition or removal of the item
  if (!itemHasKey || process.env.RELOAD_MENU_ITEMS_ON_EVERY_INSTALL === 'true') {
    const itemExists = await ctx.call('menu-builder.menuItem.exist', {
      menuKey,
      key: ctx.prefixPN(item.key),
    });

    if (!itemExists && !removed) {
      // Add the item if it does not exist and is not marked for removal
      await ctx.tx.call('menu-builder.menuItem.add', {
        ...item,
        menuKey,
        key: ctx.prefixPN(item.key),
        permissions,
        isCustomPermission,
      });
    }

    if (itemExists && removed) {
      // Remove the item if it exists and is marked for removal
      await ctx.tx.call('menu-builder.menuItem.remove', {
        menuKey,
        key: ctx.prefixPN(item.key),
      });
    }

    // Update the key-value storage
    await setKey(keyValueModel, `menu-item-${menuKey}-${item.key}`);
  }

  ctx.tx.emit(`init-menu-item-${menuKey}.${item.key}`);
}

/**
 * Adds or removes menu items based on configurations and current state.
 *
 * @param {Object} params - Input parameters.
 * @param {Object} params.keyValueModel - Model for interacting with key-value storage.
 * @param {Object} params.item - Menu item object including `item`, `permissions`, `removed`, `isCustomPermission`.
 * @param {string} params.menuKey - Key of the menu to which the item belongs.
 * @param {boolean} params.shouldWait - Whether to wait for all promises to resolve.
 * @param {Context} params.ctx - Context for making calls and emitting events.
 *
 * @returns {Promise} A promise that resolves to an array of results.
 */
async function addMenuItemsDeploy({
  keyValueModel,
  item,
  menuKey = 'menu-builder.main',
  shouldWait = false,
  ctx,
}) {
  const config = await ctx.tx.call('deployment-manager.getConfigRest', { allConfig: true });
  const items = _.flatten([item]);

  if (shouldWait) {
    return items.reduce(async (accPromise, currentItem) => {
      const acc = await accPromise;
      const result = await exec({ config, keyValueModel, item: currentItem, menuKey, ctx });
      acc.push(result);
      return acc;
    }, Promise.resolve([]));
  }

  return Promise.all(items.map((l) => exec({ config, keyValueModel, item: l, menuKey, ctx })));
}

module.exports = { addMenuItemsDeploy };

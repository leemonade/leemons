import { hasKey, setKey } from '@leemons/mongodb-helpers';
import { flatten } from 'lodash';
import type { AddMenuItemsDeployParams, ExecParams } from './types';

/**
 * Manages the addition or removal of menu items based on configurations and current state.
 */
async function exec({
  keyValueModel,
  item: { item, permissions, removed, isCustomPermission },
  menuKey,
  ctx,
}: ExecParams): Promise<void> {
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
 */
export async function addMenuItemsDeploy({
  keyValueModel,
  item,
  menuKey = 'menu-builder.main',
  shouldWait = false,
  ctx,
}: AddMenuItemsDeployParams): Promise<void[]> {
  const config = await ctx.tx.call('deployment-manager.getConfigRest', {
    allConfig: true,
  });
  const items = flatten([item]);

  if (shouldWait) {
    return items.reduce(async (accPromise, currentItem) => {
      const acc = await accPromise;
      const result = await exec({
        config,
        keyValueModel,
        item: currentItem,
        menuKey,
        ctx,
      });
      acc.push(result);
      return acc;
    }, Promise.resolve([] as void[]));
  }

  return Promise.all(items.map((l) => exec({ config, keyValueModel, item: l, menuKey, ctx })));
}

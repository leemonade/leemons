import type { Context } from "@leemons/moleculer";
import { isArray, map } from "lodash";
import type { MenuItem, MenuItemConfig } from "./types";

interface ExecParams {
  item: MenuItemConfig;
  menuKey: string;
  ctx: Context;
}

interface UpdateMenuItemParams {
  item: MenuItemConfig | MenuItemConfig[];
  menuKey?: string;
  shouldWait?: boolean;
  ctx: Context;
}

async function exec({
  item: { item, permissions },
  menuKey,
  ctx,
}: ExecParams): Promise<MenuItem | null> {
  if (
    await ctx.tx.call("menu-builder.menuItem.exist", {
      menuKey,
      key: ctx.prefixPN(item.key),
    })
  ) {
    const result = (await ctx.tx.call("menu-builder.menuItem.update", {
      ...item,
      menuKey,
      key: ctx.prefixPN(item.key),
      permissions,
      ctx,
    })) as MenuItem;
    ctx.tx.emit(`update-menu-item-${menuKey}.${item.key}`);
    return result;
  }
  return null;
}

export async function updateMenuItem({
  item,
  menuKey = "menu-builder.main",
  shouldWait = false,
  ctx,
}: UpdateMenuItemParams): Promise<(MenuItem | null)[]> {
  const items = isArray(item) ? item : [item];

  if (shouldWait) {
    const itemsLength = items.length;
    const menuItems: (MenuItem | null)[] = [];

    for (let i = 0; i < itemsLength; i++) {
      // eslint-disable-next-line no-await-in-loop
      menuItems.push(await exec({ item: items[i], menuKey, ctx }));
    }
    return menuItems;
  }
  return Promise.all(map(items, (l) => exec({ item: l, menuKey, ctx })));
}

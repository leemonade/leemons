import type { AnyContext } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import { hasKey, setKey } from '@leemons/mongodb-helpers';
import { isArray, map } from 'lodash';
import type { GetKeyValueModel } from './types';

interface Menu {
  key: string;
  permissions?: string[];
}

interface ExecParams {
  keyValueModel: Model<GetKeyValueModel>;
  menu: Menu;
  ctx: AnyContext;
}

interface AddMenusDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  menu: Menu | Menu[];
  ctx: AnyContext;
}

async function exec({ keyValueModel, menu, ctx }: ExecParams): Promise<void> {
  if (
    !(await hasKey(keyValueModel, `menu-${menu.key}`)) ||
    process.env.RELOAD_MENUS_ON_EVERY_INSTALL === 'true'
  ) {
    if (
      !(await ctx.tx.call('menu-builder.menu.exist', {
        key: menu.key,
      }))
    ) {
      await ctx.tx.call('menu-builder.menu.add', menu);
      await setKey(keyValueModel, `menu-${menu.key}`);
    }
  }
  ctx.tx.emit(`init-menu-${menu.key}`);
}

export async function addMenusDeploy({
  keyValueModel,
  menu,
  ctx,
}: AddMenusDeployParams): Promise<void> {
  const menus = isArray(menu) ? menu : [menu];
  await Promise.all(map(menus, (l) => exec({ keyValueModel, menu: l, ctx })));
}

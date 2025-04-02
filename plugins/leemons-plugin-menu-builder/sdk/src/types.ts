import type { AnyContext } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';

export interface GetKeyValueModel {
  id: string;
  key: string;
  value: unknown;
  deploymentID: string;
}

export interface MenuItem {
  key: string;
  menuKey?: string;
  order?: number;
  label?: string;
  icon?: string;
  iconFamily?: string;
  url?: string;
  parent?: string | null;
  permissions?: string[];
  isCustomPermission?: boolean;
}

export interface MenuItemConfig {
  item: MenuItem;
  permissions?: string[];
  removed?: boolean;
  isCustomPermission?: boolean;
}

export interface AddMenuItemsDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  item: MenuItemConfig | MenuItemConfig[];
  menuKey?: string;
  shouldWait?: boolean;
  ctx: AnyContext;
}

export interface ExecParams {
  keyValueModel: Model<GetKeyValueModel>;
  item: MenuItemConfig;
  menuKey: string;
  ctx: AnyContext;
  config?: any;
}

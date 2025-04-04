import type { Context } from "@leemons/moleculer";
import type { Model } from "@leemons/mongodb";

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
  label?: string | Record<string, string>;
  icon?: string;
  iconSvg?: string;
  activeIconSvg?: string;
  iconFamily?: string;
  url?: string;
  parent?: string | null;
  permissions?: string[];
  isCustomPermission?: boolean;
}

export interface MenuItemConfig {
  item: MenuItem;
  permissions?: Array<{
    permissionName: string;
    actionNames: string[];
  }>;
  removed?: boolean;
  isCustomPermission?: boolean;
}

export interface AddMenuItemsDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  item: MenuItemConfig | MenuItemConfig[];
  menuKey?: string;
  shouldWait?: boolean;
  ctx: Context;
}

export interface ExecParams {
  keyValueModel: Model<GetKeyValueModel>;
  item: MenuItemConfig;
  menuKey: string;
  ctx: Context;
  config?: any;
}

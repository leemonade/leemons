import path from 'path';

import fileExists from "../fs/fileExists";
import folderExists from '../fs/folderExists';

import { Plugin } from "./listPluginsFromPackageJson";

export interface PluginPaths extends Plugin {
  routers: {
    public: boolean;
    private: boolean;
    protected: boolean;
  };
  public: boolean;
  hooks: boolean;
  globalContext: boolean;
  localContext: boolean;
}

export default async function getPluginPaths(plugin: Plugin): Promise<PluginPaths> {
  return {
    ...plugin,
    routers: {
      public: await fileExists(path.join(plugin.path, 'Public.js')),
      private: await fileExists(path.join(plugin.path, 'Private.js')),
      protected: await fileExists(path.join(plugin.path, 'Protected.js')),
    },
    public: await folderExists(path.join(plugin.path, 'public')),
    hooks: await fileExists(path.join(plugin.path, 'globalHooks.js')),
    globalContext: await fileExists(path.join(plugin.path, 'globalContext.js')),
    localContext: await fileExists(path.join(plugin.path, 'localContext.js')),
  };
}

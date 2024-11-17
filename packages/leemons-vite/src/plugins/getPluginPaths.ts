import path from 'path';

import fileExistsMultiextension from '../fs/fileExistsMultiextension';
import folderExists from '../fs/folderExists';

import { Plugin } from './listPluginsFromPackageJson';

const EXTENSIONS = ['js', 'ts', 'jsx', 'tsx'];

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
      public: await fileExistsMultiextension(path.join(plugin.path, 'Public'), EXTENSIONS),
      private: await fileExistsMultiextension(path.join(plugin.path, 'Private'), EXTENSIONS),
      protected: await fileExistsMultiextension(path.join(plugin.path, 'Protected'), EXTENSIONS),
    },
    public: await folderExists(path.join(plugin.path, 'public')),
    hooks: await fileExistsMultiextension(path.join(plugin.path, 'globalHooks'), EXTENSIONS),
    globalContext: await fileExistsMultiextension(
      path.join(plugin.path, 'globalContext'),
      EXTENSIONS
    ),
    localContext: await fileExistsMultiextension(
      path.join(plugin.path, 'localContext'),
      EXTENSIONS
    ),
  };
}

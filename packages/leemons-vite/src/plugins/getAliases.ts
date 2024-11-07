import path from 'path';

import type { PluginPaths } from './getPluginPaths';


interface GetAliasesOptions {
  dir: string;
  plugins: PluginPaths[];
}

export default function getAliases({ dir, plugins }: GetAliasesOptions) {
  const GLOBAL_ALIASES = {
    '@app': dir,
  };

  return plugins.reduce<Record<`@${string}`, string>>((aliases, plugin) => {
    const pluginPath = path.resolve(dir, 'plugins', plugin.name, 'src');

    return {
      ...aliases,
      [`@${plugin.name}`]: pluginPath,
    };
  }, GLOBAL_ALIASES);
}

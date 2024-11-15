import path from 'path';

import type { PluginPaths } from './getPluginPaths';

interface GetAliasesOptions {
  dir: string;
  plugins: PluginPaths[];
}

export type PluginAliases = Record<`@${string}/*`, string[]>;

export default function getAliases({ dir, plugins }: GetAliasesOptions) {
  const GLOBAL_ALIASES = {
    '@app/*π': [dir],
  };

  return plugins.reduce<PluginAliases>((aliases, plugin) => {
    const pluginPath = path.resolve(dir, 'plugins', plugin.name, 'src', '*');

    return {
      ...aliases,
      [`@${plugin.name}/*`]: [pluginPath],
    };
  }, GLOBAL_ALIASES);
}

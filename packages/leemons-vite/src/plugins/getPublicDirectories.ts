import path from 'path';

import type { PluginPaths } from './getPluginPaths';

interface GetPublicDirectoriesOptions {
  dir: string;
  plugins: PluginPaths[];
}

export default function getPublicDirectories({ dir, plugins }: GetPublicDirectoriesOptions) {
  return plugins
    .filter(({ public: hasPublicDirectory }) => hasPublicDirectory)
    .map(({ name }) => ({
      from: path.resolve(dir, 'plugins', name, 'public'),
      to: path.join('public', name),
      noErrorOnMissing: true,
    }));
}

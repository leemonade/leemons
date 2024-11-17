import path from 'path';

import { copyFolder } from '../fs/copyFolder';
import { createFolderIfMissing } from '../fs/createFolderIfMissing';
import { PluginPaths } from '../plugins/getPluginPaths';

export async function copyPublicFiles(output: string, plugins: PluginPaths[]) {
  await createFolderIfMissing(path.join(output, 'public'));

  await Promise.all(
    plugins.map(async (plugin) => {
      if (plugin.public) {
        const pluginPublicPath = path.join(plugin.path, 'public');
      const publicPath = path.join(output, 'public', plugin.name);

      await copyFolder(pluginPublicPath, publicPath);
      }
    }),
  );
}

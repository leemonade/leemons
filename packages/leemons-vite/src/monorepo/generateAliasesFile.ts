import path from 'path';

import { writeJSONFile } from '../fs/writeJSONFile';
import { PluginPaths } from '../plugins/getPluginPaths';

export async function generateAliasesFile(appDir: string, plugins: PluginPaths[]) {
  const pluginsAliases = plugins.reduce<Record<string, string>>(
    (acc, plugin) => {
      acc[`@${plugin.name}`] = `/plugins/${plugin.name}/src`;
      return acc;
    },
    { '@app': '/' }
  );

  await writeJSONFile(path.resolve(appDir, 'aliases.json'), pluginsAliases);
}

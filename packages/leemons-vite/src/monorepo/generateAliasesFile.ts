import path from 'path';

import { writeJSONFile } from '../fs/writeJSONFile';
import { PluginPaths } from '../plugins/getPluginPaths';

export async function generateAliasesFile(appDir: string, plugins: PluginPaths[]) {
  const pluginsAliases = plugins.reduce((acc, plugin) => {
    acc[`@${plugin.name}`] = [`./plugins/${plugin.name}/src`];
    return acc;
  }, {});

  await writeJSONFile(path.resolve(appDir, 'aliases.json'), pluginsAliases);
}

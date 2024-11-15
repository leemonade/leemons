import path from 'path';

import { writeJSONFile } from '../fs/writeJSONFile';
import { PluginPaths } from '../plugins/getPluginPaths';
import jsConfig from '../templates/jsconfig.json';
import tsConfig from '../templates/tsconfig.json';

export async function generateTSAndJSConfig(dir: string, plugins: PluginPaths[]) {
  const aliases = plugins
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, plugin) => {
      return {
        ...acc,
        [`@${plugin.name}/*`]: ['./' + path.relative(dir, path.resolve(plugin.path, 'src', '*'))],
      };
    }, {});

  tsConfig.compilerOptions.paths = aliases;

  await writeJSONFile(path.resolve(dir, 'tsconfig.frontend.json'), tsConfig);

  await writeJSONFile(path.resolve(dir, 'jsconfig.json'), jsConfig);
}

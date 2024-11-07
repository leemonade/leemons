import path from 'path';

import chalk from 'chalk';
import {readJSON} from 'fs-extra';

interface ListPluginsFromPackageJsonOptions {
  app: string;
}

export interface Plugin {
  name: string;
  path: string;
}

export default async function listPluginsFromPackageJson({ app }: ListPluginsFromPackageJsonOptions) {
  try {
    const packageJSON = await readJSON(path.resolve(app, 'package.json'));

    const plugins: Plugin[] = [];

    const dependencies = Object.keys(packageJSON?.dependencies ?? {});

    dependencies.forEach((dependency) => {
      if (dependency.includes('leemons-plugin-') && dependency.includes('frontend-react')) {
        const pluginPath = path.dirname(require.resolve(`${dependency}/package.json`));

        plugins.push({
          name: dependency.replace(/^leemons-plugin-/, '').replace(/-frontend-react(-private)?$/, ''),
          path: pluginPath,
        });
      }
    });

    if (!plugins.length) {
      console.warn(chalk`{yellowBright Warning:} No plugins found in {bold ${app}}`);
    }

    return plugins;
  } catch (e) {
    console.error(chalk`{redBright Error:} Cannot read package.json in {bold ${app}}`);
    throw e;
  }
}

const fs = require('fs-extra');
const path = require('path');

async function getJsConfig(basePath) {
  try {
    const jsConfig = await fs.readJSON(path.resolve(basePath, 'jsconfig.json'));

    if (jsConfig) {
      return jsConfig;
    }

    throw new Error('jsconfig.json not found');
  } catch (e) {
    return {
      compilerOptions: {
        module: 'CommonJS',
        moduleResolution: 'Node',
        target: 'ES2020',
        jsx: 'react',
        baseUrl: '.',
      },
      exclude: ['node_modules', '**/node_modules/*'],
      include: ['./packages/**/*'],
    };
  }
}

module.exports = async function createJsConfig({
  plugins,
  basePath = path.resolve(__dirname, '../../../../'),
}) {
  if (!basePath) {
    throw new Error('basePath is required to create jsconfig.json');
  }

  const config = await getJsConfig(basePath);

  const paths = {};

  plugins
    // EN: Sort plugins by name so that the order is consistent
    // ES: Ordena los plugins por nombre para que el orden sea consistente
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((plugin) => {
      const relativePath = path.relative(basePath, plugin.path);
      const pluginName = `@${plugin.name}/*`;

      if (plugin.name === 'common') {
        paths[`@${plugin.name}`] = [`./${relativePath}/src/index`];
      }

      paths[pluginName] = [`./${relativePath}/src/*`];
    });

  config.compilerOptions.paths = paths;

  await fs.writeJSON(path.resolve(basePath, 'jsconfig.json'), config, {
    encoding: 'utf8',
    spaces: 2,
  });
};

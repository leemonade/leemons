const fs = require('fs-extra');
const path = require('path');

async function getJsConfig(basePath) {
  try {
    const jsConfig = await fs.readJSON(path.resolve(basePath, 'tsconfig.frontend.json'));

    if (jsConfig) {
      return jsConfig;
    }

    throw new Error('tsconfig.frontend.json not found');
  } catch (e) {
    return {
      extends: './tsconfig.base.json',
      compilerOptions: {
        target: 'ESNext',
        lib: ['DOM', 'DOM.Iterable', 'ESNext'],
        module: 'ESNext',
        jsx: 'react',
      },
      exclude: ['node_modules', '**/node_modules/*'],
      include: ['./plugins/*/frontend/**/*', './private-plugins/*/frontend/**/*'],
    };
  }
}

module.exports = async function createJsConfig({
  plugins,
  basePath = path.resolve(__dirname, '../../../../'),
}) {
  if (!basePath) {
    throw new Error('basePath is required to create tsconfig.json');
  }

  const config = await getJsConfig(basePath);

  const paths = {};

  plugins
    // EN: Sort plugins by name so that the order is consistent
    // ES: Ordena los plugins por nombre para que el orden sea consistente
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((plugin) => {
      const relativePath = path.relative(basePath, plugin.path);
      const pluginName = `@${plugin.name
        .replace('-frontend-react-private', '')
        .replace('-frontend-react', '')}/*`;

      const srcPath = `./${relativePath}/src/*`;

      if (fs.existsSync(path.resolve(basePath, `${relativePath}/dist`))) {
        // TODO: check if we need to point to the dist folder
        // srcPath = `./${relativePath}/dist/*`;
      }

      paths[pluginName] = [srcPath];
    });

  config.compilerOptions.paths = paths;

  await fs.writeJSON(path.resolve(basePath, 'tsconfig.frontend.json'), config, {
    encoding: 'utf8',
    spaces: 2,
  });
};

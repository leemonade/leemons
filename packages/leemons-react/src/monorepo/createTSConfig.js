const fs = require('fs-extra');
const path = require('path');

const tsConfigFilename = 'tsconfig.frontend.json';
const tsConfigPath = (basePath) => path.resolve(basePath, tsConfigFilename);

async function getTsConfig(basePath) {
  try {
    const jsConfig = await fs.readJSON(tsConfigPath(basePath));

    if (jsConfig) {
      return jsConfig;
    }

    throw new Error(`${tsConfigFilename} not found`);
  } catch (e) {
    return {
      extends: './tsconfig.base.json',
      compilerOptions: {
        target: 'ESNext',
        lib: ['DOM', 'DOM.Iterable', 'ESNext'],
        module: 'ESNext',
        jsx: 'react',
      },
      exclude: ['node_modules'],
      include: ['./plugins/*/frontend/**/*', './private-plugins/*/frontend/**/*'],
    };
  }
}

module.exports = async function createTsConfig({
  plugins,
  basePath = path.resolve(__dirname, '../../../../'),
}) {
  if (!basePath) {
    throw new Error(`basePath is required to create ${tsConfigFilename}`);
  }

  const config = await getTsConfig(basePath);

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

  await fs.writeJSON(tsConfigPath(basePath), config, {
    encoding: 'utf8',
    spaces: 2,
  });
};

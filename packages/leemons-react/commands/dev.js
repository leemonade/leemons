const { generateEnv } = require('@leemons/utils');

const generateMonorepo = require('../src/monorepo');
const getAppDir = require('../src/paths/getAppDir');
const getBasePath = require('../src/paths/getBasePath');
const getBuildDir = require('../src/paths/getBuildDir');
const getOutputDir = require('../src/paths/getOutputDir');
const getPlugins = require('../src/plugins');
const generateAlias = require('../src/plugins/generateAlias');
const generatePublicFolders = require('../src/plugins/generatePublicFolders');
const rspackDevServer = require('../src/rspack/devServer');
const webpackDevServer = require('../src/webpack/devServer');

module.exports = async function dev({ app, build, output, base, port, rspack }) {
  process.env.NODE_ENV = 'development';
  process.env.PORT = port;

  const env = await generateEnv('.env', false);
  Object.keys(env).forEach((key) => {
    process.env[key] = env[key];
  });

  const outputDir = getOutputDir(output);
  const appDir = getAppDir(app);
  const buildDir = getBuildDir(build);
  const basePath = getBasePath(base);

  const pluginsRaw = await getPlugins({ app: appDir });
  const plugins = pluginsRaw.map((plugin) => ({
    ...plugin,
    name: plugin.name.replace('-frontend-react-private', '').replace('-frontend-react', ''),
  }));
  const publicFiles = await generatePublicFolders(outputDir, plugins);
  const alias = generateAlias(outputDir, plugins);

  await generateMonorepo({ plugins, app: appDir, outputDir, basePath });

  const devServer = rspack ? rspackDevServer : webpackDevServer;
  await devServer({ app: outputDir, alias, build: buildDir, publicFiles });
};

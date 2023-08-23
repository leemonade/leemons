const getAppDir = require('../src/paths/getAppDir');
const getPlugins = require('../src/plugins');
const generateMonorepo = require('../src/monorepo');
const getOutputDir = require('../src/paths/getOutputDir');
const generateAlias = require('../src/plugins/generateAlias');
const generatePublicFolders = require('../src/plugins/generatePublicFolders');
const devServer = require('../src/webpack/devServer');
const getBuildDir = require('../src/paths/getBuildDir');
const getBasePath = require('../src/paths/getBasePath');
const { generateEnv } = require('leemons-utils/src/env');

module.exports = async function dev({ app, build, output, base, port }) {
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

  const plugins = await getPlugins({ app: appDir });
  const pluginsWithShortName = plugins.map((plugin) => {
    return {
      ...plugin,
      name: plugin.name.replace('-frontend-react', ''),
    };
  });
  const publicFiles = await generatePublicFolders(outputDir, pluginsWithShortName);
  const alias = generateAlias(outputDir, pluginsWithShortName);

  await generateMonorepo({ plugins: pluginsWithShortName, app: appDir, outputDir, basePath });

  await devServer({ app: outputDir, alias, build: buildDir, publicFiles });
};

const getAppDir = require('../src/paths/getAppDir');
const getPlugins = require('../src/plugins');
const generateMonorepo = require('../src/monorepo');
const getOutputDir = require('../src/paths/getOutputDir');
const generateAlias = require('../src/plugins/generateAlias');
const generatePublicFolders = require('../src/plugins/generatePublicFolders');
const buildApp = require('../src/webpack/build');
const getBuildDir = require('../src/paths/getBuildDir');
const getBasePath = require('../src/paths/getBasePath');
const { generateEnv } = require('../../leemons-utils/lib/env');

module.exports = async function buildFront({ app, build, output, base }) {
  process.env.NODE_ENV = 'production';

  const env = await generateEnv('.env', false);
  Object.keys(env).forEach((key) => {
    process.env[key] = env[key];
  });

  const outputDir = getOutputDir(output);
  const appDir = getAppDir(app);
  const buildDir = getBuildDir(build);
  const basePath = getBasePath(base);

  const plugins = await getPlugins({ app: appDir });
  const publicFiles = await generatePublicFolders(outputDir, plugins);
  const alias = generateAlias(outputDir, plugins);

  await generateMonorepo({ plugins, app: appDir, outputDir, basePath });

  await buildApp({ app: outputDir, alias, build: buildDir, publicFiles });
};

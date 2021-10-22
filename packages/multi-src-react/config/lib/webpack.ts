import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import chalk from 'chalk';
const { createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');

type webpackTapFunction = (args_0: webpack.Compiler) => Promise<void>;

// Compile
export default async function compile(
  _config: Object,
  onChange: webpackTapFunction = async () => {}
): Promise<Function> {
  // eslint-disable-next-line global-require
  const config = (await require('../webpack.config'))(_config);
  const urls = prepareUrls('http', '0.0.0.0', 8080);
  const compiler = createCompiler({
    appName: 'Leemons App',
    config,
    urls,
    useYarn: true,
    useTypeScript: false,
    webpack,
  });

  // const compiler = webpack(config);

  compiler.hooks.watchRun.tapPromise('Leemons', onChange);
  // Development

  const devServer = new WebpackDevServer(config.devServer, compiler);

  const stop = (): Promise<void> =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve) => {
      await devServer.stop();
      compiler.close(() => {
        resolve();
      });
    });

  await devServer.start();
  // Stop compiler and dev server
  return stop;
}

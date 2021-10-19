import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

type webpackTapFunction = (args_0: webpack.Compiler) => Promise<void>;

// Compile
export default async function compile(
  _config: Object,
  onChange: webpackTapFunction = async () => {}
): Promise<Function> {
  // eslint-disable-next-line global-require
  const config = await require('../webpack.config');
  const compiler = webpack(config(_config));

  compiler.hooks.watchRun.tapPromise('Leemons', onChange);
  // Development

  /* @ts-ignore */
  const devServer = new WebpackDevServer(
    {
      historyApiFallback: true,
      port: 3000,
    },
    compiler
  );

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

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

  // Build
  // compiler.run(() => console.log('Compiled'));
  // Development

  /* @ts-ignore */
  const devServer = new WebpackDevServer(
    {
      historyApiFallback: true,
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

  /* @ts-ignore */
  compiler.hooks.compilation.tap('Leemons', (compilation) => {
    compilation.hooks.failedModule.tap('Leemons', () => {
      console.log('error ocurred');
      console.log();
      throw new Error('Pepe');
    });
  });
  // Stop compiler and dev server
  return stop;
}

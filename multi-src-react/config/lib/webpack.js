const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

// Compile
async function compile(_config, onChange = () => {}) {
  // eslint-disable-next-line global-require
  const config = await require('../webpack.config');
  const compiler = webpack(config(_config));

  compiler.hooks.watchRun.tapPromise('Leemons', onChange);

  // Build
  // compiler.run(() => console.log('Compiled'));
  // Development
  const devServer = new WebpackDevServer(
    {
      historyApiFallback: true,
    },
    compiler
  );

  const stop = () =>
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

module.exports = {
  compile,
};

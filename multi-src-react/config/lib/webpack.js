const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const { resolve } = require("../webpack.config");

// Compile
async function compile(_config, onChange = () => {}) {
  const config = await require("../webpack.config");
  const compiler = webpack(config(_config));

  compiler.hooks.watchRun.tapPromise("Leemons", onChange);

  const devServer = new WebpackDevServer(
    {
      historyApiFallback: true,
    },
    compiler
  );

  const stop = () => {
    return new Promise(async (resolve) => {
      await devServer.stop();
      await compiler.close(() => {
        resolve();
      });
    });
  };

  await devServer.start();

  // Stop compiler and dev server
  return stop;
}

module.exports = {
  compile,
};

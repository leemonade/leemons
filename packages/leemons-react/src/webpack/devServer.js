const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ora = require('ora');
const chalk = require('chalk');
const webpackConfig = require('./webpack.config');
const { parseWebpackMessage } = require('./parseWebpackMessage');

module.exports = async function startDevServer({ app, build, alias, publicFiles }) {
  const config = webpackConfig({ app, build, alias, publicFiles, isDev: true });
  const devServerOptions = config.devServer;

  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    console.log(chalk`{red[ERROR]} {gray Failed to compile}`);
    console.log(e.message || e);
  }

  const devServer = new WebpackDevServer({ ...devServerOptions, setupExitSignals: true }, compiler);

  await devServer.start();

  parseWebpackMessage(compiler);

  let exiting = false;
  const exitSpinner = ora();

  const handler = () => {
    if (!exiting) {
      global.spinner.stopAndPersist({
        symbol: '🚫',
        text: 'Server is shutting down...',
      });

      console.clear();
      exiting = true;

      console.log(chalk`{gray Press Ctrl+C again to force stop.}`);
      exitSpinner.start('Server is shutting down...');

      devServer.stopCallback((error) => {
        if (error) {
          exitSpinner.error('Server failed to stop.');
          console.log(chalk`{redBright [ERROR]} ${error.message}`);
        }

        exitSpinner.succeed('Server stopped.');
        process.exit(0);
      });
    } else {
      exitSpinner.warn('Force stopping...');
      process.exit(0);
    }
  };

  const signals = ['SIGINT', 'SIGTERM'];

  signals.forEach((signal) => {
    process.on(signal, handler);
  });
};

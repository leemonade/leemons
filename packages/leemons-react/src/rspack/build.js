const rspack = require('@rspack/core');
const boxen = require('boxen');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');

const { formatWebpackMessages } = require('../webpack/parseWebpackMessage');

const rspackConfig = require('./rspack.config');

const { isTTY } = process.stdout;

function getRelativePath(dir) {
  const relativePath = path.relative(process.cwd(), dir);

  if (relativePath.startsWith('.')) {
    return relativePath;
  }

  return `./${relativePath}`;
}

module.exports = async function buildApp({ app, alias, build, publicFiles }) {
  const config = rspackConfig({ app, alias, build, publicFiles, isDev: false, lazy: false });
  const compiler = rspack(config);

  const startTime = Date.now();

  if (isTTY) {
    const spinner = ora(chalk`Starting {yellow Leemons} front build`).start();
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        spinner.fail(chalk`{red Compilation failed with errors}`);
        const parsedStats = stats.toJson({
          errors: true,
        });

        const { errors } = formatWebpackMessages(parsedStats);

        console.error(errors.join('\n'));
        process.exit(1);
      }

      spinner.succeed(
        chalk`{green Compiled {yellow Leemons} successfully in ${(Date.now() - startTime) / 1000}s}`
      );

      console.log(
        boxen(
          chalk`{gray The app was built in} {underline ${getRelativePath(
            build
          )}}\n\n{gray To preview the app, run} {cyan leemonsFront preview}`,
          {
            margin: 1,
            padding: 1,
          }
        )
      );

      compiler.close(() => {});
    });
  } else {
    console.log(chalk`Starting {yellow Leemons} front build`);
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(chalk`{red Compilation failed with errors}`);
        const parsedStats = stats.toJson({
          errors: true,
        });

        const { errors } = formatWebpackMessages(parsedStats);

        console.error(errors[0]);
        return;
      }

      console.log(
        chalk`{green Compiled {yellow Leemons} successfully in ${(Date.now() - startTime) / 1000}s}`
      );

      console.log(
        boxen(
          chalk`{gray The app was built in} {underline ${getRelativePath(
            build
          )}}\n\n{gray To preview the app, run} {cyan leemonsFront preview}`,
          {
            margin: 1,
            padding: 1,
          }
        )
      );

      compiler.close(() => {});
    });
  }
};

#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const packageJSON = require('../package.json');
const dev = require('../commands/dev');
const build = require('../commands/build');
const preview = require('../commands/preview');

// CLI setup
program.allowUnknownOption(true);
program.version(packageJSON.version);

// $leemonsFront dev
program
  .command('dev')
  .option('-a, --app <dir>', 'app directory')
  .option('-o, --output <dir>', 'output directory')
  .option('-b, --build <dir>', 'build directory')
  .option('-p, --port <port>', 'port to use for the dev server, defaults to 3000', 3000)
  .option(
    '-m, --base <path>',
    "base path of the leemons monorepo, if you are not running on the leemons monorepo, you don't need to set this"
  )
  .description('Launches leemons frontend in development mode')
  .action(dev);

// $leemonsFront build
program
  .command('build')
  .option('-a, --app <dir>', 'app directory')
  .option('-o, --output <dir>', 'output directory')
  .option('-b, --build <dir>', 'build directory')
  .option(
    '-m, --base <path>',
    "base path of the leemons monorepo, if you are not running on the leemons monorepo, you don't need to set this"
  )
  .description('Builds leemons frontend in production mode')
  .action(build);

// $leemonsFront preview
program
  .command('preview')
  .option('-b, --build <dir>', 'build directory')
  .option('-p, --port <port>', 'port to use for the preview server, defaults to 3000', 3000)
  .description('Launches the builded leemons frontend')
  .action(preview);

program.parseAsync(process.argv);

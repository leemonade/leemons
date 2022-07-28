#!/usr/bin/env node

const chalk = require('chalk');
const { Command } = require('commander');
const resolveCwd = require('resolve-cwd');

const packageJSON = require('../package.json');

const program = new Command();

function getLocalCommand(commandName) {
  return (...args) => {
    const cmdPath = resolveCwd.silent(`${__dirname}/../lib/commands/${commandName}`);
    if (!cmdPath) {
      process.stderr.write(chalk`{red The command {yellow ${commandName}} was not found}\n`);
      process.exit(1);
    }
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const script = require(cmdPath);
    try {
      script(...args);
    } catch (e) {
      process.stderr.write(
        chalk`{red An error ocurred while running the command {yellow ${commandName}}}\n{gray ${e.message}}`
      );
      process.exit(1);
    }
  };
}

// CLI setup
program.allowUnknownOption(true);
program.version(packageJSON.version);

// $leemons start
program
  .command('start')
  .option('-N, --frontend <dir>', 'frontend directory')
  .option('-L, --level <level>', 'log level')
  .description('Launches leemons application in production mode')
  .action(getLocalCommand('start'));

// $leemons dev
program
  .command('dev')
  .option('-L, --level <level>', 'log level')
  .description('Launches leemons application in production mode')
  .action(getLocalCommand('dev'));

program.parseAsync(process.argv);

#!/usr/bin/env node

import { Command } from 'commander';

import {version} from '../package.json';
import dev from '../src/commands/dev';

// CLI setup
const program = new Command();
program.version(version);

// $leemonsFront dev
program
  .command('dev')
  .option('-a, --app <dir>', 'app directory')
  .option('-o, --output <dir>', 'output directory')
  .option('-b, --build <dir>', 'build directory')
  .option('-p, --port <port>', 'port to use for the dev server, defaults to 3000', '3000')
  .option(
    '-m, --base <path>',
    "base path of the leemons monorepo, if you are not running on the leemons monorepo, you don't need to set this"
  )
  .description('Launches leemons frontend in development mode')
  .action(dev);

program.parseAsync(process.argv);

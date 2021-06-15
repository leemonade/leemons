#!/usr/bin/env node
const { Command } = require('commander');
const packageJSON = require('../package.json');
const cla = require('../lib');

const program = new Command(packageJSON.name);

program.allowUnknownOption(true);
program.version(packageJSON.version);

program.arguments('[appName]').usage('[app name]').action(cla);

program.parseAsync(process.argv);

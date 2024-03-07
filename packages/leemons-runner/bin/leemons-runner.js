#!/usr/bin/env node

const Runner = require('../lib/runner');

const runner = new Runner();
runner.start(process.argv);

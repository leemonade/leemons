#!/usr/bin/env node

"use strict";

const Runner = require("../lib/runner");

const runner = new Runner();
runner.start(process.argv);

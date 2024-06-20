#!/usr/bin/env node

const path = require('path');

const { createOpenapiFiles } = require('../lib/createOpenapiFiles');

const rootDir = process.argv[2] || path.join(__dirname, '..', '..', '..');

console.log('Creating openapi files from', rootDir);
createOpenapiFiles(rootDir);

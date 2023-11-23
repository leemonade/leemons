#!/usr/bin/env node

const path = require('path');

const { createOpenapiFiles } = require('../createOpenapiFiles');

const rootDir = path.join(__dirname, '..', '..', '..', '..');

console.log('Creating openapi files from', rootDir);
createOpenapiFiles(rootDir);

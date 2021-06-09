const fs = require('fs-extra');
const chalk = require('chalk');
const exitWithError = require('./exitWithError');

module.exports = async (dir, name) => {
  try {
    await fs.mkdir(dir);
  } catch (e) {
    exitWithError(chalk`{red An error occurred while creating the {underline ${name}} folder}`);
  }
};

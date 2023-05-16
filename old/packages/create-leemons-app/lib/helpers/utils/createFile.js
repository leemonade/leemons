const fs = require('fs-extra');
const chalk = require('chalk');
const exitWithError = require('./exitWithError');

module.exports = async (dir, content, name) => {
  try {
    await fs.writeFile(dir, content);
  } catch (e) {
    exitWithError(chalk`{red The ${name} file can not be created}`);
  }
};

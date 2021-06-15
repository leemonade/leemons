const path = require('path');
const fs = require('fs-extra');
const exitWithError = require('./helpers/utils/exitWithError');

module.exports = async (template, routes) => {
  const localFrontDir = path.join(__dirname, 'templates', template, 'front');
  const frontDir = path.join(routes.app, routes.next);
  try {
    // Copy front files
    await fs.copy(localFrontDir, frontDir);
  } catch (e) {
    exitWithError('An error occurred while generating the frontend directories');
  }
};

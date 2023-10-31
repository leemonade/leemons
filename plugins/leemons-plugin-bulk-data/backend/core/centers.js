/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importCenters = require('./bulk/centers');

async function initCenters({ file, ctx }) {
  try {
    const centers = await importCenters(file);
    const centersKeys = keys(centers);

    for (let i = 0, len = centersKeys.length; i < len; i++) {
      const centerKey = centersKeys[i];
      const centerData = await ctx.call('users.centers.add', {
        ...centers[centerKey],
      });
      centers[centerKey] = centerData;
    }

    return centers;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initCenters;

/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importCenters = require('./bulk/centers');

async function initCenters() {
  const { services } = leemons.getPlugin('users');

  try {
    const centers = await importCenters();
    const centersKeys = keys(centers);

    for (let i = 0, len = centersKeys.length; i < len; i++) {
      const centerKey = centersKeys[i];
      const centerData = await services.centers.add(centers[centerKey]);
      centers[centerKey] = centerData;
    }

    // console.log('------ CENTERS ------');
    // console.dir(centers, { depth: null });

    return centers;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initCenters;

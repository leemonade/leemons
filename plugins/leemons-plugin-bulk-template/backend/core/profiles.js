/* eslint-disable no-await-in-loop */
const { keys, isArray, isEmpty } = require('lodash');
const importProfiles = require('./bulk/profiles');

async function initProfiles(file) {
  const { services } = leemons.getPlugin('users');

  try {
    const profiles = await importProfiles(file);
    const itemsKeys = keys(profiles);

    // ·····················································
    // PROFILES & PERSMISSIONS

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const { accessTo, ...item } = profiles[itemKey];

      // console.dir(item, { depth: null });

      const itemData = await services.profiles.saveBySysName({ ...item, sysName: itemKey });
      profiles[itemKey] = { ...itemData, accessTo };
    }

    // ·····················································
    // ACCESS
    // Some profiles can access to other profiles userAgents

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const item = profiles[itemKey];
      if (isArray(item.accessTo) && !isEmpty(item.accessTo)) {
        await Promise.all(
          item.accessTo.map((profileFrom) =>
            services.profiles.addProfileContact(profiles[profileFrom].id, item.id)
          )
        );
      }
    }

    return profiles;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initProfiles;

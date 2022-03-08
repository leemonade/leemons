/* eslint-disable no-await-in-loop */
const { keys, isArray, isEmpty } = require('lodash');
const importProfiles = require('./bulk/profiles');

async function initProfiles() {
  const { services } = leemons.getPlugin('users');

  try {
    const profiles = await importProfiles();
    const itemsKeys = keys(profiles);

    // ·····················································
    // PROFILES & PERSMISSIONS

    // console.log('------ PROFILES ------');

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const { accessTo, ...item } = profiles[itemKey];

      // console.dir(item, { depth: null });

      const itemData = await services.profiles.add(item);
      profiles[itemKey] = { ...itemData, accessTo };
    }

    // console.log('------ PROFILES CREATED ------');
    // console.dir(profiles, { depth: null });

    // ·····················································
    // ACCESS
    // Some profiles can access to other profiles userAgents

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const item = profiles[itemKey];
      if (isArray(item.accessTo) && !isEmpty(item.accessTo)) {
        // console.log('------ ACCESS TO ------');
        /* console.dir(
          item.accessTo.map((profileFrom) => ({ from: profiles[profileFrom].id, to: item.id })),
          { depth: null }
        );
        */
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

/* eslint-disable no-await-in-loop */
const { keys, isArray, isEmpty } = require('lodash');
const importProfiles = require('./bulk/profiles');

async function initProfiles({ file, ctx }) {
  try {
    const profiles = await importProfiles(file);
    const itemsKeys = keys(profiles);

    // ·····················································
    // PROFILES & PERSMISSIONS

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const { accessTo, ...item } = profiles[itemKey];
      const itemData = await ctx.call('users.profiles.saveBySysName', {
        ...item,
        sysName: itemKey,
      });
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
            ctx.call('users.profiles.addProfileContact', {
              fromProfile: profiles[profileFrom].id,
              toProfile: item.id,
            })
          )
        );
      }
    }

    return profiles;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initProfiles;

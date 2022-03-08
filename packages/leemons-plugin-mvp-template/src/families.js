const { keys, map } = require('lodash');
const importFamilyProfiles = require('./bulk/families/profiles');
const importFamilies = require('./bulk/families');

async function initFamilies(profiles, users) {
  const { services } = leemons.getPlugin('families');

  try {
    // ·····················································
    // FAMILY PROFILES

    const { guardian, student } = await importFamilyProfiles(profiles);

    await services.config.setGuardianProfile(guardian.id);
    await services.config.setStudentProfile(student.id);

    // console.log('------ FAMILY PROFILES -----');
    // console.dir({ guardian, student }, { depth: null });

    // ·····················································
    // FAMILY RELATIONSHIPS

    const families = await importFamilies(users);

    // console.log('------ FAMILIES -----');
    // console.dir(families, { depth: null });

    // ·······························································
    // USER AGENTS ACCESS TO
    // Guardians can access to students userAgents

    const userAgentContacts = [];

    keys(families).forEach((key) => {
      const family = families[key];
      family.relations.forEach((relation) =>
        userAgentContacts.push(
          leemons
            .getPlugin('users')
            .services.users.addUserAgentContacts(
              map(relation.student.userAgents, 'id'),
              map(relation.guardian.userAgents, 'id')
            )
        )
      );
    });

    await Promise.all(userAgentContacts);

    return families;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initFamilies;

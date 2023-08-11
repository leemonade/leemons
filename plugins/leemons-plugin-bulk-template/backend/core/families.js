const { keys, map, uniq } = require('lodash');
const importFamilyProfiles = require('./bulk/families/profiles');
const importFamilies = require('./bulk/families');

async function initFamilies(file, profiles, users) {
  const { services } = leemons.getPlugin('families');

  try {
    // ·····················································
    // FAMILY PROFILES

    const { guardian, student } = await importFamilyProfiles(file, profiles);

    await services.config.setGuardianProfile(guardian.id);
    await services.config.setStudentProfile(student.id);

    // ·····················································
    // FAMILY RELATIONSHIPS

    const families = await importFamilies(file, users);
    const familiesData = [];

    keys(families).forEach((key) => {
      const { relations, ...family } = families[key];
      const guardians = uniq(relations.map((relation) => relation.guardian.userAgents[0].user)).map(
        (userId) => ({ user: userId, memberType: 'guardian' })
      );

      const students = uniq(relations.map((relation) => relation.student.userAgents[0].user)).map(
        (userId) => ({ user: userId, memberType: 'student' })
      );

      familiesData.push({ ...family, guardians, students });
    });

    await Promise.all(familiesData.map((family) => services.family.add(family)));

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

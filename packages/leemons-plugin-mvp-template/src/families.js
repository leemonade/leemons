const { keys, map, uniq } = require('lodash');
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

    // ·····················································
    // FAMILY RELATIONSHIPS

    const families = await importFamilies(users);

    /*
{
name: "Nombre de la familia",
guardians: [{user: 'id-del-usuario', memberType: 'guardian'}],
students: [{user: 'id-del-usuario', memberType: 'student'}],
maritalStatus: 'married|divorced|domestic_partners|cohabitants|separated',
emergencyPhoneNumbers: [{name: 'Nombre del contacto', phone: 'El telefono', relation: 'father|mother|legal_guardian|cualquier-texto-se-tomara-como-other'}]
}
    */
    const familiesData = [];

    keys(families).forEach((key) => {
      const { name, ...family } = families[key];
      const guardians = uniq(
        family.relations.map((relation) => relation.guardian.userAgents[0].user)
      ).map((userId) => ({ user: userId, memberType: 'guardian' }));

      const students = uniq(
        family.relations.map((relation) => relation.student.userAgents[0].user)
      ).map((userId) => ({ user: userId, memberType: 'student' }));

      familiesData.push({ name, guardians, students });
    });

    console.dir(familiesData, { depth: null });

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

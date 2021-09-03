const _ = require('lodash');
const { table } = require('../tables');
const { getMembers } = require('./getMembers');
const { removeMember } = require('../family-members/removeMember');
const { removeDatasetValues } = require('./removeDatasetValues');

/**
 * Remove the family
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove(family, { transacting } = {}) {
  const menuBuilderServices = leemons.getPlugin('menu-builder').services;
  const { guardians, students } = await getMembers(family, { transacting });

  const promises = [];

  promises.push(
    menuBuilderServices.menuItem.remove(
      menuBuilderServices.config.constants.mainMenuKey,
      leemons.plugin.prefixPN(`family-${family}`),
      { transacting }
    )
  );
  promises.push(table.families.delete({ id: family }, { transacting }));
  promises.push(removeDatasetValues(family, { transacting }));

  _.forEach(guardians, (guardian) => {
    promises.push(removeMember(family, guardian.id, { transacting }));
  });
  _.forEach(students, (student) => {
    promises.push(removeMember(family, student.id, { transacting }));
  });
  const familyEmergencyNumbers = leemons.getPlugin('families-emergency-numbers');
  if (familyEmergencyNumbers) {
    promises.push(
      familyEmergencyNumbers.services.emergencyPhones.removeFamilyPhones(family, { transacting })
    );
  }

  await Promise.all(promises);
}

module.exports = { remove };

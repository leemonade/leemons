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
  const { guardians, students } = getMembers(family, { transacting });

  const promises = [];

  promises.push(table.families.delete({ id: family }, { transacting }));
  promises.push(removeDatasetValues(family, { transacting }));

  _.forEach(guardians, (guardian) => {
    promises.push(removeMember(family, guardian.id, { transacting }));
  });
  _.forEach(students, (student) => {
    promises.push(removeMember(family, student.id, { transacting }));
  });

  await Promise.all(promises);
}

module.exports = { remove };

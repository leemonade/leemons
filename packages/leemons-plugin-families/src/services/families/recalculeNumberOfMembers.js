const _ = require('lodash');
const { table } = require('../tables');

/**
 * Recalcule the nStudents, nGuardians, nMembers values of the family
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function recalculeNumberOfMembers(family, { transacting } = {}) {
  const [nStudents, nGuardians] = await Promise.all([
    table.familyMembers.count({ family, memberType: 'student' }, { transacting }),
    table.familyMembers.count({ family, memberType_$ne: 'student' }, { transacting }),
  ]);
  return await table.families.update(
    { id: family },
    {
      nGuardians,
      nStudents,
      nMembers: nGuardians + nStudents,
    },
    { transacting }
  );
}

module.exports = { recalculeNumberOfMembers };

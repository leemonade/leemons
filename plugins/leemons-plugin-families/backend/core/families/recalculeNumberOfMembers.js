const _ = require('lodash');
/**
 * Recalcule the nStudents, nGuardians, nMembers values of the family
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function recalculeNumberOfMembers({ family, ctx }) {
  const [nStudents, nGuardians] = await Promise.all([
    ctx.tx.db.FamilyMembers.countDocuments({ family, memberType: 'student' }),
    ctx.tx.db.FamilyMembers.countDocuments({ family, memberType: { $ne: 'student' } }),
  ]);
  return ctx.tx.db.Families.findOneAndUpdate(
    { id: family },
    {
      nGuardians,
      nStudents,
      nMembers: nGuardians + nStudents,
    },
    { lean: true, new: true }
  );
}

module.exports = { recalculeNumberOfMembers };

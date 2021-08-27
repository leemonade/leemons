const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistMemberInFamily } = require('../../validations/exists');

/**
 * Remove family member
 * @public
 * @static
 * @param {string} family - Family id
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeMember(family, user, { transacting } = {}) {
  await validateNotExistMemberInFamily(family, user, { transacting });
  const member = await table.familyMembers.delete({ family, user }, { transacting });

  // TODO Quitar todos los permisos o todo lo que haya que quitarle al dejar de estar en esta familia

  return member;
}

module.exports = { removeMember };

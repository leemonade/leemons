const _ = require('lodash');
const { table } = require('../tables');
const { validateExistMemberInFamily } = require('../../validations/exists');
const { getProfiles } = require('../profiles-config/getProfiles');

/**
 * Add family member
 * @public
 * @static
 * @param {{family: string, user: string, memberType: string}} data - New member data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addMember({ family, user, memberType }, { transacting } = {}) {
  await validateExistMemberInFamily(family, user, { transacting });
  const member = await table.familyMembers.create({ family, user, memberType }, { transacting });

  // TODO Añadir a todos los miembros el permiso de ver esta familia con la tabla de users:item-permissions
  // TODO Añadir permisos para el menu item/añadir men item custom o como se vaya a hacer

  return member;
}

module.exports = { addMember };

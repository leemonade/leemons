const _ = require('lodash');
const { isFamilyMember } = require('./isFamilyMember');

/**
 * Return true if the specific user session have permits to update the specific family
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any} userSession - User session
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function canUpdateFamily(familyId, userSession, { transacting } = {}) {
  // TODO Añadir que devuelva true a aquellas personas que tengan el permiso de ver esta familia en la tabla de users:item-permissions
  if (await isFamilyMember(familyId, userSession, { transacting })) return true;
  const permissions = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
      query: {
        permissionName: 'plugins.families.families',
        actionName_$in: ['update', 'admin'],
      },
    });
  return !!permissions.length;
}

module.exports = { canUpdateFamily };

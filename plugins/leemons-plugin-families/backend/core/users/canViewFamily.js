const { isFamilyMember } = require('./isFamilyMember');

/**
 * Return true if the specific user session have permits to view the specific family
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any} userSession - User session
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function canViewFamily({ familyId, ctx }) {
  // TODO Añadir que devuelva true a aquellas personas que tengan el permiso de ver esta familia en la tabla de users:item-permissions
  if (await isFamilyMember({ familyId, ctx })) return true;
  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: 'families.families',
      actionName: ['view', 'admin'],
    },
  });
  return !!permissions.length;
}

module.exports = { canViewFamily };

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
async function addMember({ family, user, memberType, ctx }) {
  await validateExistMemberInFamily({ family, user, ctx });
  const [member, profiles] = await Promise.all([
    ctx.tx.db.FamilyMembers.create({ family, user, memberType }).then((r) => r.toObject()),
    getProfiles({ ctx }),
  ]);

  const profile = memberType === 'student' ? profiles.student : profiles.guardian;

  await ctx.tx.call('users.permissions.addCustomPermissionToUserProfile', {
    user,
    profile,
    permissions: [
      {
        permissionName: 'families.user-families',
        actionNames: ['view'],
      },
      {
        permissionName: `families.family-${family}`,
        actionNames: ['view'],
      },
    ],
  });

  // TODO Añadir a todos los miembros el permiso de ver esta familia con la tabla de users:item-permissions

  return member;
}

module.exports = { addMember };

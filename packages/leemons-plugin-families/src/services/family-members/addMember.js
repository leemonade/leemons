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
  const permissionsService = leemons.getPlugin('users').services.permissions;
  await validateExistMemberInFamily(family, user, { transacting });
  const [member, profiles] = await Promise.all([
    table.familyMembers.create({ family, user, memberType }, { transacting }),
    getProfiles({ transacting }),
  ]);

  const profile = memberType === 'student' ? profiles.student : profiles.guardian;

  await permissionsService.addCustomPermissionToUserProfile(
    user,
    profile,
    [
      {
        permissionName: 'plugins.families.user-families',
        actionNames: ['view'],
      },
      {
        permissionName: `plugins.families.family-${family}`,
        actionNames: ['view'],
      },
    ],
    { transacting }
  );

  // TODO Añadir a todos los miembros el permiso de ver esta familia con la tabla de users:item-permissions

  return member;
}

module.exports = { addMember };

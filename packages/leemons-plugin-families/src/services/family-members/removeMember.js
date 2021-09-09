const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistMemberInFamily } = require('../../validations/exists');
const { getProfiles } = require('../profiles-config/getProfiles');

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
  const permissionsService = leemons.getPlugin('users').services.permissions;
  await validateNotExistMemberInFamily(family, user, { transacting });
  const member = await table.familyMembers.findOne({ family, user }, { transacting });
  const [profiles] = await Promise.all([
    getProfiles({ transacting }),
    table.familyMembers.delete({ family, user }, { transacting }),
  ]);

  const isStudent = member.memberType === 'student';
  const profile = isStudent ? profiles.student : profiles.guardian;
  // ES: Borramos el permiso de ver a la familia, asi ya no le sale en el menu
  // EN: We delete the permission to see the family, so it does not appear in the menu.
  const permissionsToRemove = [`plugins.families.family-${family}`];

  // ES: Una vez borrado de la familia comprobamos si ya no esta en ninguna familia, si no esta en
  // ninguna le quitamos el permiso de que le salga el menu item de familias
  // EN: Once deleted from the family we check if it is no longer in any family, if it is not in any
  // family we remove the permission for the family menu item to appear.
  const query = { user };
  if (isStudent) {
    query.memberType = 'student';
  } else {
    query.memberType_$ne = 'student';
  }
  const inAnyFamily = await table.familyMembers.count(query, { transacting });
  if (!inAnyFamily) {
    permissionsToRemove.push('plugins.families.user-families');
  }

  await permissionsService.removeCustomPermissionToUserProfile(user, profile, permissionsToRemove, {
    transacting,
  });

  return member;
}

module.exports = { removeMember };

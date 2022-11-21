const { groupBy } = require('lodash');

async function getClassesPermissions(assetsIds, { transacting }) {
  const ids = Array.isArray(assetsIds) ? assetsIds : [assetsIds];

  const { services: userService } = leemons.getPlugin('users');
  const permissions = await userService.permissions.findItems(
    {
      item_$in: ids,
      permissionName_$startsWith: 'plugins.academic-portfolio.class.',
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );

  const permissionsByAsset = groupBy(permissions, 'item');

  return ids.map(
    (id) =>
      permissionsByAsset[id]?.map((permission) => ({
        class: permission.permissionName.replace(`plugins.academic-portfolio.class.`, ''),
        role: permission.type === leemons.plugin.prefixPN('asset.can-edit') ? 'editor' : 'viewer',
      })) ?? []
  );
}

module.exports = { getClassesPermissions };

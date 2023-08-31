const { groupBy, uniq } = require('lodash');

async function getClassesPermissions(assetsIds, { withInfo, transacting, userSession }) {
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

  const classesData = {};
  if (withInfo) {
    const classes = uniq(
      permissions.map((permission) =>
        permission.permissionName.replace(`plugins.academic-portfolio.class.`, '')
      )
    );

    if (classes.length) {
      const { services: aPortoflioServices } = leemons.getPlugin('academic-portfolio');
      const classesInfo = await aPortoflioServices.classes.classByIds(classes, {
        userSession,
        transacting,
      });

      classesInfo.forEach((klass) => {
        classesData[klass.id] = {
          id: klass.id,
          subject: klass.subject.id,
          fullName: klass.groups.isAlone
            ? klass.subject.name
            : `${klass.subject.name} - ${klass.groups.name}`,
          icon: klass.subject.icon,
          color: klass.color,
        };
      });
    }
  }

  const permissionsByAsset = groupBy(permissions, 'item');

  return ids.map(
    (id) =>
      permissionsByAsset[id]?.map((permission) => {
        let role = 'viewer';
        if (permission.type === leemons.plugin.prefixPN('asset.can-edit')) {
          role = 'editor';
        }

        if (permission.type === leemons.plugin.prefixPN('asset.can-assign')) {
          role = 'assigner';
        }
        const classId = permission.permissionName.replace(`plugins.academic-portfolio.class.`, '');
        return {
          ...classesData[classId],
          class: classId,
          role,
        };
      }) ?? []
  );
}

module.exports = { getClassesPermissions };

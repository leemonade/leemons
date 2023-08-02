const { groupBy, uniq } = require('lodash');

async function getClassesPermissions({ assetsIds, withInfo, ctx }) {
  const ids = Array.isArray(assetsIds) ? assetsIds : [assetsIds];

  const permissions = await ctx.tx.call('users.permissions.findItems', {
    params: {
      item: ids,
      // permissionName_$startsWith: 'academic-portfolio.class.',
      permissionName: /^academic-portfolio.class/i,
      // type_$startsWith: leemons.plugin.prefixPN('asset'),
      type: `/^${ctx.prefixPN('asset')}/i`,
    },
  });

  const classesData = {};
  if (withInfo) {
    const classes = uniq(
      permissions.map((permission) =>
        permission.permissionName.replace(`academic-portfolio.class.`, '')
      )
    );

    if (classes.length) {
      const classesInfo = await ctx.tx.call('academic-portfolio.classes.classByIds', {
        ids: classes,
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
        const classId = permission.permissionName.replace(`academic-portfolio.class.`, '');
        return {
          ...classesData[classId],
          class: classId,
          role: permission.type === ctx.prefixPN('asset.can-edit') ? 'editor' : 'viewer',
        };
      }) ?? []
  );
}

module.exports = { getClassesPermissions };

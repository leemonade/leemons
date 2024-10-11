const { groupBy, uniq, escapeRegExp } = require('lodash');

/**
 * getClassesPermissions is a function that retrieves the permissions for classes.
 *
 * @param {Object} params - An object containing the following properties:
 * @param {Array} params.assetsIds - An array of asset IDs to be checked against.
 * @param {Boolean} params.withInfo - A boolean indicating whether to include additional class information.
 * @param {MoleculerContext} params.ctx - An object representing the context.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of permissions after mapping and filtering.
 */
async function getClassesPermissions({ assetsIds, withInfo, ctx }) {
  const ids = Array.isArray(assetsIds) ? assetsIds : [assetsIds];

  const permissions = await ctx.tx.call('users.permissions.findItems', {
    params: {
      item: ids,
      permissionName: { $regex: `^${escapeRegExp('academic-portfolio.class.')}` },
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
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
        const className =  !klass.groups || klass.groups?.isAlone
        ? klass.subject.name
        : `${klass.subject.name} - ${klass.groups.name}`;
        classesData[klass.id] = {
          id: klass.id,
          subject: klass.subject.id,
          name: className,
          fullName: className,
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
        if (permission.type === ctx.prefixPN('asset.can-edit')) {
          role = 'editor';
        }

        if (permission.type === ctx.prefixPN('asset.can-assign')) {
          role = 'assigner';
        }
        const classId = permission.permissionName.replace(`academic-portfolio.class.`, '');
        return {
          ...classesData[classId],
          class: classId,
          role,
        };
      }) ?? []
  );
}

module.exports = { getClassesPermissions };

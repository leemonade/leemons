const _ = require('lodash');
const { getProfiles } = require('../../settings/getProfiles');

function process({ classItems, key, classesById, profiles, ctx }) {
  return Promise.allSettled(
    _.map(_.uniqBy(classItems, key), (item) =>
      ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
        userAgentId: item[key],
        data: {
          permissionName: `academic-portfolio.program-profile.inside.${
            classesById[item.class].program
          }.${profiles[key]}`,
          actionNames: ['view'],
        },
      })
    )
  );
}

async function syncProgramProfilePermissionsIfNeed({ ctx }) {
  // TODO Migration: Hemos usado la llamada a deploy manager para ver si está instalado o no
  // ? Está eso bien?
  // * No entiendo muy bien la lógica
  const isInstalled = await ctx.tx.call('deployment-manager.pluginIsInstalled', {
    pluginName: 'academic-portfolio',
  });

  if (isInstalled) {
    const hasKey = await ctx.tx.db.Configs.findOne({
      key: '__syncProgramProfilePermissionsIfNeed2__',
    }).lean();
    if (!hasKey) {
      console.log('---------- syncProgramProfilePermissionsIfNeed');

      const classes = await ctx.tx.db.Class.find({}).lean();
      const classStudents = await ctx.tx.db.ClassStudent.find({}).lean();
      const classTeachers = await ctx.tx.db.ClassTeacher.find({}).lean();
      const profiles = await getProfiles({ ctx });
      const classesById = _.keyBy(classes, 'id');

      await process({ classItems: classStudents, key: 'student', classesById, profiles, ctx });
      await process({ classItems: classTeachers, key: 'teacher', classesById, profiles, ctx });

      await ctx.tx.db.Configs.create({
        key: '__syncProgramProfilePermissionsIfNeed2__',
        value: 'true',
      });
    }
  } else {
    await ctx.tx.db.Configs.create({
      key: '__syncProgramProfilePermissionsIfNeed2__',
      value: 'true',
    });
  }
}

module.exports = { syncProgramProfilePermissionsIfNeed };

const _ = require('lodash');
const { getProfiles } = require('../../settings');
const { table } = require('../../tables');

function process(
  classItems,
  key,
  { addCustomPermissionToUserAgent, classesById, profiles, transacting }
) {
  return Promise.allSettled(
    _.map(_.uniqBy(classItems, key), (item) =>
      addCustomPermissionToUserAgent(
        item[key],
        {
          permissionName: `plugins.academic-portfolio.program-profile.inside.${
            classesById[item.class].program
          }.${profiles[key]}`,
          actionNames: ['view'],
        },
        { transacting }
      )
    )
  );
}

async function syncProgramProfilePermissionsIfNeed(
  isInstalled,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (isInstalled) {
        const hasKey = await table.configs.findOne(
          {
            key: '__syncProgramProfilePermissionsIfNeed2__',
          },
          { transacting }
        );
        if (!hasKey) {
          console.log('---------- syncProgramProfilePermissionsIfNeed');
          const { addCustomPermissionToUserAgent } =
            leemons.getPlugin('users').services.permissions;
          const classes = await table.class.find({}, { transacting });
          const classStudents = await table.classStudent.find({}, { transacting });
          const classTeachers = await table.classTeacher.find({}, { transacting });
          const profiles = await getProfiles({ transacting });
          const classesById = _.keyBy(classes, 'id');

          await process(classStudents, 'student', {
            addCustomPermissionToUserAgent,
            classesById,
            profiles,
            transacting,
          });
          await process(classTeachers, 'teacher', {
            addCustomPermissionToUserAgent,
            classesById,
            profiles,
            transacting,
          });

          await table.configs.create(
            { key: '__syncProgramProfilePermissionsIfNeed2__', value: 'true' },
            { transacting }
          );
        }
      } else {
        await table.configs.create(
          { key: '__syncProgramProfilePermissionsIfNeed2__', value: 'true' },
          { transacting }
        );
      }
    },
    table.configs,
    _transacting
  );
}

module.exports = { syncProgramProfilePermissionsIfNeed };

const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateItemProfiles } = require('../../validation/forms');

async function updateProfiles(items, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateUpdateItemProfiles(items);
      let profiles = [];
      _.forEach(items, (item) => {
        profiles = profiles.concat(item.profiles);
      });
      // ES: Comprobamos que existan los perfiles
      if (_.isArray(profiles) && profiles.length > 0) {
        const existsProfiles = await leemons
          .getPlugin('users')
          .services.profiles.existMany(_.uniq(profiles), { transacting });
        if (!existsProfiles) {
          throw new Error('Profiles does not exist');
        }
      }

      // ES:  Borramos los perfiles actuales de los items
      await Promise.all(
        _.map(items, (item) =>
          table.widgetItemProfile.deleteMany(
            {
              zoneKey: item.zoneKey,
              key: item.key,
            },
            { transacting }
          )
        )
      );

      // ES: Insertamos los nuevos perfiles
      return Promise.all(
        _.map(items, (item) =>
          Promise.all(
            _.map(item.profiles, (profile) =>
              table.widgetItemProfile.create(
                {
                  profile,
                  zoneKey: item.zoneKey,
                  key: item.key,
                },
                { transacting }
              )
            )
          )
        )
      );
    },
    table.widgetItem,
    _transacting
  );
}

module.exports = { updateProfiles };

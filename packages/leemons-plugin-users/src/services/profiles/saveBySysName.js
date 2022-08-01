const { table } = require('../tables');
const { update } = require('./update');
const { add } = require('./add');

async function saveBySysName({ sysName, ...data }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      let profile = await table.profiles.findOne(
        {
          sysName,
        },
        { transacting }
      );

      if (profile) {
        profile = await update({ id: profile.id, ...data }, { transacting });
      } else {
        profile = await add(data, { sysName, transacting });
      }

      return profile;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { saveBySysName };

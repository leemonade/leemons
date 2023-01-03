const _ = require('lodash');
const { table } = require('../tables');

async function saveManagers(userAgents, type, relationship, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await table.managers.deleteMany({ type, relationship }, { transacting });
      if (userAgents) {
        const _userAgents = _.isArray(userAgents) ? userAgents : [userAgents];
        const promises = [];
        _.forEach(_userAgents, (userAgent) => {
          promises.push(
            table.managers.create(
              {
                relationship,
                type,
                userAgent,
              },
              { transacting }
            )
          );
        });
        return Promise.all(promises);
      }
      return [];
    },
    table.managers,
    _transacting
  );
}

module.exports = { saveManagers };

const _ = require('lodash');
const { table } = require('../tables');
const { getCanEditProfiles } = require('../configs/getCanEditProfiles');
const { getNodeLevelSchema } = require('./getNodeLevelSchema');
const { updateNodeLevelSchema } = require('./updateNodeLevelSchema');

async function updateNodeLevelFormPermissions(
  nodeLevelId,
  { profiles: _profiles, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      let profiles = _profiles;
      if (!_.isArray(profiles)) {
        profiles = await getCanEditProfiles({ transacting });
      }
      const schema = await getNodeLevelSchema(nodeLevelId, null, { transacting });
      if (schema) {
        _.forIn(schema.jsonSchema.properties, (item, key) => {
          schema.jsonSchema.properties[key].permissions = {
            '*': ['view'],
          };
          _.forEach(profiles, (profile) => {
            schema.jsonSchema.properties[key].permissions[profile] = ['view', 'edit'];
          });
        });
        await updateNodeLevelSchema(schema, { transacting });
      }
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { updateNodeLevelFormPermissions };

const _ = require('lodash');
const { getCanEditProfiles } = require('../configs/getCanEditProfiles');
const { getNodeLevelSchema } = require('./getNodeLevelSchema');
const { updateNodeLevelSchema } = require('./updateNodeLevelSchema');

async function updateNodeLevelFormPermissions({ nodeLevelId, profiles: _profiles, ctx }) {
  let profiles = _profiles;
  if (!_.isArray(profiles)) {
    profiles = await getCanEditProfiles({ ctx });
  }
  const schema = await getNodeLevelSchema({ nodeLevelId, locale: null, ctx });
  if (schema) {
    _.forIn(schema.jsonSchema.properties, (item, key) => {
      schema.jsonSchema.properties[key].permissions = {
        '*': ['view'],
      };
      _.forEach(profiles, (profile) => {
        schema.jsonSchema.properties[key].permissions[profile] = ['view', 'edit'];
      });
    });
    await updateNodeLevelSchema({ schemaData: schema, ctx });
  }
}

module.exports = { updateNodeLevelFormPermissions };

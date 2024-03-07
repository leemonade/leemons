/* eslint-disable global-require */

const { getKeyValueModel } = require('@leemons/mongodb-helpers');

const models = {
  ...require('./families'),
  ...require('./family-members'),
  ...require('./profiles-config'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Families: models.familiesModel,
      FamilyMembers: models.familyMembersModel,
      ProfilesConfig: models.profilesConfigModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::families_KeyValue' }),
    };
  },
};

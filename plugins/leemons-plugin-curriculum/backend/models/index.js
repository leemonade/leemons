/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./configs'),
  ...require('./curriculums'),
  ...require('./nodeLevels'),
  ...require('./nodes'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Configs: models.configsModel,
      Curriculums: models.curriculumsModel,
      NodeLevels: models.nodeLevelsModel,
      Nodes: models.nodesModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::curriculum_KeyValue' }),
    };
  },
};

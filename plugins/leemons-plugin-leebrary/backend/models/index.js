/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./assets'),
  ...require('./assetsFiles'),
  ...require('./assetsSubjects'),
  ...require('./bookmarks'),
  ...require('./categories'),
  ...require('./files'),
  ...require('./pins'),
  ...require('./settings'),
};

module.exports = {
  ...models,
  Assets: models.assetsModel,
  AssetsFiles: models.assetsFilesModel,
  AssetsSubjects: models.assetsSubjectsModel,
  Bookmarks: models.bookmarksModel,
  Categories: models.categoriesModel,
  Files: models.filesModel,
  Pins: models.pinsModel,
  Settings: models.settingsModel,
  getServiceModels() {
    return {
      Actions: models.actionsModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::leebrary_KeyValue' }),
    };
  },
};

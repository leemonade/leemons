/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');
const { pluginName } = require('../config/constants');

const models = {
  ...require('./config'),
  ...require('./multipart-etag'),
  ...require('./multipart-uploads'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Config: models.configModel,
      MultipartEtag: models.multipartEtagModel,
      MultipartUploads: models.multipartUploadsModel,
      KeyValue: getKeyValueModel({
        modelName: `v1::${pluginName}_KeyValue`,
      }),
    };
  },
};

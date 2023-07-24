/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./config'),
  ...require('./emailTemplate'),
  ...require('./emailTemplateDetail'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Config: models.configModel,
      EmailTemplate: models.emailTemplateModel,
      EmailTemplateDetail: models.emailTemplateDetailModel,
      KeyValue: getKeyValueModel({ modelName: 'emails_KeyValue' }),
    };
  },
};

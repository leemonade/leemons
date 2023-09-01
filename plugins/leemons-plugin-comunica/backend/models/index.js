/* eslint-disable global-require */

const { getKeyValueModel } = require('leemons-mongodb-helpers');

const models = {
  ...require('./config'),
  ...require('./message'),
  ...require('./room'),
  ...require('./roomMessagesUnRead'),
  ...require('./userAgentConfig'),
  ...require('./userAgentInRoom'),
};

module.exports = {
  ...models,
  getServiceModels() {
    return {
      Config: models.configModel,
      Message: models.messageModel,
      Room: models.roomModel,
      RoomMessagesUnRead: models.roomMessagesUnReadModel,
      UserAgentConfig: models.userAgentConfigModel,
      UserAgentInRoom: models.userAgentInRoomModel,
      KeyValue: getKeyValueModel({ modelName: 'v1::comunica_KeyValue' }),
    };
  },
};

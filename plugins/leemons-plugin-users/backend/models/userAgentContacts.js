const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
    },
    fromUserAgent: {
      // ref: 'users_UserAgent',
      type: String,
      required: true,
    },
    fromCenter: {
      // ref: 'users_Centers',
      type: String,
      required: true,
    },
    fromProfile: {
      // ref: 'users_Profiles',
      type: String,
      required: true,
    },
    toUserAgent: {
      // ref: 'users_UserAgent',
      type: String,
      required: true,
    },
    toCenter: {
      // ref: 'users_Centers',
      type: String,
      required: true,
    },
    toProfile: {
      // ref: 'users_Profiles',
      type: String,
      required: true,
    },
    pluginName: {
      type: String,
      required: true,
    },
    target: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({
  fromUserAgent: 1,
  toUserAgent: 1,
  pluginName: 1,
  target: 1,
  deploymentID: 1,
  isDeleted: 1,
});

schema.index({
  fromUserAgent: 1,
  deploymentID: 1,
  isDeleted: 1,
});

schema.index({
  fromUserAgent: 1,
  toUserAgent: 1,
  deploymentID: 1,
  isDeleted: 1,
});

const userAgentContactsModel = newModel(mongoose.connection, 'v1::users_UserAgentContacts', schema);

module.exports = { userAgentContactsModel };

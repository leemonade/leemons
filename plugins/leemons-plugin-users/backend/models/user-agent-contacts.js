const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    fromUserAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_UserAgent',
      required: true,
    },
    fromCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Centers',
      required: true,
    },
    fromProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Profiles',
      required: true,
    },
    toUserAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_UserAgent',
      required: true,
    },
    toCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Centers',
      required: true,
    },
    toProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Profiles',
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
  }
);

const userAgentContactsModel = newModel(mongoose.connection, 'users_UserAgentContacts', schema);

module.exports = { userAgentContactsModel };

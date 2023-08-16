const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      required: true,
      /*
      references: {
        collection: 'plugins_users::user-agent',
      }
      */
    },
    muted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const userAgentConfigModel = newModel(mongoose.connection, 'v1::comunica_UserAgentConfig', schema);

module.exports = { userAgentConfigModel };

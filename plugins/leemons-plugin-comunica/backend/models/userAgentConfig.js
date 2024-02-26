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
    minimize: false,
  }
);

schema.index({ userAgent: 1, deploymentID: 1, isDeleted: 1 });

const userAgentConfigModel = newModel(mongoose.connection, 'v1::comunica_UserAgentConfig', schema);

module.exports = { userAgentConfigModel };

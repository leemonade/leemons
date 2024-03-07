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
    group: {
      type: String,
      // ref: 'users_Groups',
      required: true,
    },
    userAgent: {
      // ref: 'users_UserAgent',
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ group: 1, userAgent: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ group: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ userAgent: 1, deploymentID: 1, isDeleted: 1 });

const groupUserAgentModel = newModel(mongoose.connection, 'v1::users_GroupUserAgent', schema);

module.exports = { groupUserAgentModel };

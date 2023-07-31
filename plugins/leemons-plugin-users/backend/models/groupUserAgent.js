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
  }
);

const groupUserAgentModel = newModel(mongoose.connection, 'v1::users_GroupUserAgent', schema);

module.exports = { groupUserAgentModel };

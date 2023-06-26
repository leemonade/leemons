const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Groups',
      required: true,
    },
    userAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_UserAgent',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const groupUserAgentModel = newModel(mongoose.connection, 'users_GroupUserAgent', schema);

module.exports = { groupUserAgentModel };

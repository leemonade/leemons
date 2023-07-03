const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Users',
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Roles',
      required: true,
    },
    reloadPermissions: {
      type: Boolean,
      default: false,
    },
    datasetIsGood: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const userAgentModel = newModel(mongoose.connection, 'users_UserAgent', schema);

module.exports = { userAgentModel };

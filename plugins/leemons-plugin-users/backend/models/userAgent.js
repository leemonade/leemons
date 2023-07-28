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
    user: {
      // ref: 'users_Users',
      type: String,
      required: true,
    },
    role: {
      // ref: 'users_Roles',
      type: String,
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

const userAgentModel = newModel(mongoose.connection, 'v1::users_UserAgent', schema);

module.exports = { userAgentModel };

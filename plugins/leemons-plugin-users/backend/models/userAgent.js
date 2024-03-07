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
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, user: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ user: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ user: 1, profile: 1, deploymentID: 1, isDeleted: 1 });

const userAgentModel = newModel(mongoose.connection, 'v1::users_UserAgent', schema);

module.exports = { userAgentModel };

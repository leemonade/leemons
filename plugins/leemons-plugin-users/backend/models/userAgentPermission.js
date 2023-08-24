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
      // ref: 'users_UserAgent',
      type: String,
      required: true,
    },
    permissionName: {
      type: String,
      required: true,
      index: true,
    },
    actionName: {
      type: String,
      required: true,
      index: true,
    },
    target: {
      type: String,
      index: true,
    },
    role: {
      // ref: 'users_Roles',
      type: String,
    },
    center: {
      // ref: 'users_Centers',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userAgentPermissionModel = newModel(
  mongoose.connection,
  'v1::users_UserAgentPermission',
  schema
);

module.exports = { userAgentPermissionModel };

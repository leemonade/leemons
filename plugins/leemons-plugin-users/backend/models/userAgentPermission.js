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
      // ref: 'users_UserAgent',
      type: String,
      required: true,
    },
    permissionName: {
      type: String,
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
    target: {
      type: String,
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
    minimize: false,
  }
);

schema.index({ actionName: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ userAgent: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ userAgent: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ permissionName: 1, userAgent: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({
  permissionName: 1,
  userAgent: 1,
  role: 1,
  target: 1,
  deploymentID: 1,
  isDeleted: 1,
});
schema.index({
  permissionName: 1,
  userAgent: 1,
  role: 1,
  center: 1,
  deploymentID: 1,
  isDeleted: 1,
});

const userAgentPermissionModel = newModel(
  mongoose.connection,
  'v1::users_UserAgentPermission',
  schema
);

module.exports = { userAgentPermissionModel };

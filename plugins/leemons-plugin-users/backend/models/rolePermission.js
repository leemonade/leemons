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
    role: {
      // ref: 'users_Roles',
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
    isCustom: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, permissionName: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ permissionName: 1, target: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, permissionName: 1, target: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, isCustom: 1, deploymentID: 1, isDeleted: 1 });

const rolePermissionModel = newModel(mongoose.connection, 'v1::users_RolePermission', schema);

module.exports = { rolePermissionModel };

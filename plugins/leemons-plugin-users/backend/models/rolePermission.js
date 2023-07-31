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
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const rolePermissionModel = newModel(mongoose.connection, 'v1::users_RolePermission', schema);

module.exports = { rolePermissionModel };

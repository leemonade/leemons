const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema({
  deploymentID: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users_Roles',
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
});

const rolePermissionModel = newModel(mongoose.connection, 'users_RolePermission', schema);

module.exports = { rolePermissionModel };

const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);

const permissionActionModel = newModel(mongoose.connection, 'users_PermissionAction', schema);

module.exports = { permissionActionModel };

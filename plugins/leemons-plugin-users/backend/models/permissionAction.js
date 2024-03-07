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
    permissionName: {
      type: String,
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ permissionName: 1, actionName: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ permissionName: 1, deploymentID: 1, isDeleted: 1 });

const permissionActionModel = newModel(mongoose.connection, 'v1::users_PermissionAction', schema);

module.exports = { permissionActionModel };

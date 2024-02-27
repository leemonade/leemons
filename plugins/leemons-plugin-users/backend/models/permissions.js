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
    pluginName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ permissionName: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ permissionName: 1, pluginName: 1, deploymentID: 1, isDeleted: 1 });

const permissionsModel = newModel(mongoose.connection, 'v1::users_Permissions', schema);

module.exports = { permissionsModel };

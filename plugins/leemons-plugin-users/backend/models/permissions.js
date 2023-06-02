const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
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
  }
);

const permissionsModel = newModel(mongoose.connection, 'users_Permissions', schema);

module.exports = { permissionsModel };

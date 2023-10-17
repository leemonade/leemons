const { mongoose, newModel } = require('@leemons/mongodb');

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

const permissionsModel = newModel(mongoose.connection, 'v1::users_Permissions', schema);

module.exports = { permissionsModel };

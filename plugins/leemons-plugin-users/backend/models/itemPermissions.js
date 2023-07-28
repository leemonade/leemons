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
    type: {
      type: String,
      required: true,
      index: true,
    },
    item: {
      type: String,
      required: true,
      index: true,
    },
    center: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const itemPermissionsModel = newModel(mongoose.connection, 'v1::users_ItemPermissions', schema);

module.exports = { itemPermissionsModel };

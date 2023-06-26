const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      index: true,
      unique: true,
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

const itemPermissionsModel = newModel(mongoose.connection, 'users_ItemPermissions', schema);

module.exports = { itemPermissionsModel };

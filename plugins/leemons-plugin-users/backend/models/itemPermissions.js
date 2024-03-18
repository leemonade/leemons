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
    minimize: false,
  }
);

schema.index({ item: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ item: 1, userAgentId: 1, deploymentID: 1, isDeleted: 1 });

const itemPermissionsModel = newModel(mongoose.connection, 'v1::users_ItemPermissions', schema);

module.exports = { itemPermissionsModel };

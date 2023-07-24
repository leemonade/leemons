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
    userAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_UserAgent',
      required: true,
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
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Roles',
      required: true,
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Centers',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userAgentPermissionModel = newModel(
  mongoose.connection,
  'v1::users_UserAgentPermission',
  schema
);

module.exports = { userAgentPermissionModel };

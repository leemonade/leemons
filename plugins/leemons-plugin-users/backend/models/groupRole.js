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
    group: {
      type: String,
      // ref: 'users_Groups',
      required: true,
    },
    role: {
      type: String,
      // ref: 'users_Roles',
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ group: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, deploymentID: 1, isDeleted: 1 });

const groupRoleModel = newModel(mongoose.connection, 'v1::users_GroupRole', schema);

module.exports = { groupRoleModel };

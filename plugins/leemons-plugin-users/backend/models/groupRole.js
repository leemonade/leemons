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
  }
);

const groupRoleModel = newModel(mongoose.connection, 'v1::users_GroupRole', schema);

module.exports = { groupRoleModel };

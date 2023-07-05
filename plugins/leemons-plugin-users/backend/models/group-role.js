const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Groups',
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Roles',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const groupRoleModel = newModel(mongoose.connection, 'users_GroupRole', schema);

module.exports = { groupRoleModel };

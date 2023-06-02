const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Profiles',
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

const profileRoleModel = newModel(mongoose.connection, 'users_ProfileRole', schema);

module.exports = { profileRoleModel };

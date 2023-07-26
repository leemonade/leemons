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
    profile: {
      type: String,
      // ref: 'users_Profiles',
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

const profileRoleModel = newModel(mongoose.connection, 'v1::users_ProfileRole', schema);

module.exports = { profileRoleModel };

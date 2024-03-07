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
    minimize: false,
  }
);

schema.index({ profile: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ profile: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, deploymentID: 1, isDeleted: 1 });

const profileRoleModel = newModel(mongoose.connection, 'v1::users_ProfileRole', schema);

module.exports = { profileRoleModel };

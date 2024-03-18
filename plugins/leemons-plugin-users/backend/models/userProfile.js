const { mongoose, newModel } = require('@leemons/mongodb');

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
    user: {
      // ref: 'users_Users',
      type: String,
      required: true,
    },
    profile: {
      // ref: 'users_Profiles',
      type: String,
      required: true,
    },
    role: {
      // ref: 'users_Roles',
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ profile: 1, user: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const userProfileModel = newModel(mongoose.connection, 'v1::users_UserProfile', schema);

module.exports = { userProfileModel };

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
    center: {
      // ref: 'users_Centers',
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const userRememberLoginModel = newModel(mongoose.connection, 'v1::users_UserRememberLogin', schema);

module.exports = { userRememberLoginModel };

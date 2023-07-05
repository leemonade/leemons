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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Users',
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Profiles',
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

const userRememberLoginModel = newModel(mongoose.connection, 'users_UserRememberLogin', schema);

module.exports = { userRememberLoginModel };

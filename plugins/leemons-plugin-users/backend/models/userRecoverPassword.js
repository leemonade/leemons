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
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const userRecoverPasswordModel = newModel(
  mongoose.connection,
  'v1::users_UserRecoverPassword',
  schema
);

module.exports = { userRecoverPasswordModel };

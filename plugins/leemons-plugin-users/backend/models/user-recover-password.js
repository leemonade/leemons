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
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userRecoverPasswordModel = newModel(mongoose.connection, 'users_UserRecoverPassword', schema);

module.exports = { userRecoverPasswordModel };

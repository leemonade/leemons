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

const userRegisterPasswordModel = newModel(
  mongoose.connection,
  'v1::users_UserRegisterPassword',
  schema
);

module.exports = { userRegisterPasswordModel };

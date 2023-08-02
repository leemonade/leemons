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
      // ref: 'users_Users',
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const superAdminUserModel = newModel(mongoose.connection, 'v1::users_SuperAdminUser', schema);

module.exports = { superAdminUserModel };

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
    role: {
      // ref: 'users_Roles',
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
  }
);

const roleCenterModel = newModel(mongoose.connection, 'v1::users_RoleCenter', schema);

module.exports = { roleCenterModel };

const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Roles',
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

const roleCenterModel = newModel(mongoose.connection, 'users_RoleCenter', schema);

module.exports = { roleCenterModel };

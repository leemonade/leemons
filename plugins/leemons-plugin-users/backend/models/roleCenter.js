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
    minimize: false,
  }
);

schema.index({ center: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ center: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const roleCenterModel = newModel(mongoose.connection, 'v1::users_RoleCenter', schema);

module.exports = { roleCenterModel };

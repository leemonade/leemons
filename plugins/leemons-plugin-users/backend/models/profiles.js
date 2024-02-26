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
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    uri: {
      type: String,
      required: true,
    },
    role: {
      // ref: 'users_Roles',
      type: String,
    },
    indexable: {
      type: Boolean,
      required: true,
      default: true,
    },
    sysName: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, name: 1 }, { unique: true });
schema.index({ deploymentID: 1, uri: 1 }, { unique: true });

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ sysName: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ uri: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ name: 1, deploymentID: 1, isDeleted: 1 });

const profilesModel = newModel(mongoose.connection, 'v1::users_Profiles', schema);

module.exports = { profilesModel };

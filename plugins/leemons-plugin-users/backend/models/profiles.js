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
  }
);

schema.index({ deploymentID: 1, name: 1 }, { unique: true });
schema.index({ deploymentID: 1, uri: 1 }, { unique: true });

const profilesModel = newModel(mongoose.connection, 'v1::users_Profiles', schema);

module.exports = { profilesModel };

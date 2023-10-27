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
    type: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      // ref: 'plugins_users::profiles',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const profilesConfigModel = newModel(mongoose.connection, 'v1::families_ProfilesConfig', schema);

module.exports = { profilesConfigModel };

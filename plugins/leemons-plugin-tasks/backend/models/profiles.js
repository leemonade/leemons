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
    key: {
      type: String,
    },
    profile: {
      type: String, // uuid
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const profilesModel = newModel(mongoose.connection, 'v1::tasks_Profiles', schema);

module.exports = { profilesModel };

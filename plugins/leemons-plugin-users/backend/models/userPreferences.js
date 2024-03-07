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
    user: {
      type: String,
      // ref: 'users_Users',
      required: true,
    },
    gender: {
      type: String,
    },
    pronoun: {
      type: String,
    },
    pluralPronoun: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ user: 1, deploymentID: 1, isDeleted: 1 });

const userPreferencesModel = newModel(mongoose.connection, 'v1::users_UserPreferences', schema);

module.exports = { userPreferencesModel };

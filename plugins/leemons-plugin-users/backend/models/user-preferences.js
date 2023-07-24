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
  }
);

const userPreferencesModel = newModel(mongoose.connection, 'v1::users_UserPreferences', schema);

module.exports = { userPreferencesModel };

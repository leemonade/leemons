const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
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

const userPreferencesModel = newModel(mongoose.connection, 'users_UserPreferences', schema);

module.exports = { userPreferencesModel };

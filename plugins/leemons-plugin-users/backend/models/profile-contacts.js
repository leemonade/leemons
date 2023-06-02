const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    fromProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Profiles',
      required: true,
    },
    toProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users_Profiles',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const profileContactsModel = newModel(mongoose.connection, 'users_ProfileContacts', schema);

module.exports = { profileContactsModel };

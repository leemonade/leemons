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
    fromProfile: {
      // ref: 'users_Profiles',
      type: String,
      required: true,
    },
    toProfile: {
      // ref: 'users_Profiles',
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const profileContactsModel = newModel(mongoose.connection, 'v1::users_ProfileContacts', schema);

module.exports = { profileContactsModel };

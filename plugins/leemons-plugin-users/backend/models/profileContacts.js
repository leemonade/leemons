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
    minimize: false,
  }
);

schema.index({ fromProfile: 1, toProfile: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ fromProfile: 1, deploymentID: 1, isDeleted: 1 });

const profileContactsModel = newModel(mongoose.connection, 'v1::users_ProfileContacts', schema);

module.exports = { profileContactsModel };

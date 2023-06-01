const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users_Roles',
    required: true,
  },
  indexable: {
    type: Boolean,
    required: true,
    default: true,
  },
  sysName: {
    type: String,
  },
});

schema.index({ deploymentID: 1, name: 1 }, { unique: true });
schema.index({ deploymentID: 1, uri: 1 }, { unique: true });

const profilesModel = newModel(mongoose.connection, 'users_Profiles', schema);

module.exports = { profilesModel };

const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema({
  deploymentID: {
    type: String,
    required: true,
    index: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  },
});

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const configModel = newModel(mongoose.connection, 'users_Config', schema);

module.exports = { configModel };

// -- Keys --
// jwt-private-key
// platform-locale

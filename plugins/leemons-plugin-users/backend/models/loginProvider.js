const { mongoose, newModel } = require('@leemons/mongodb/src');

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  deploymentID: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const loginProviderModel = newModel(mongoose.connection, 'v1::users_LoginProviders', schema);

module.exports = { loginProviderModel };

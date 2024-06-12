const { mongoose, newModel } = require('@leemons/mongodb/src');
const { MODELS_PREFIX } = require('../config/constants');

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
      unique: true,
    },
    userPool: {
      type: String,
      required: true,
      unique: true,
    },
    identityProviders: {
      type: [String],
      default: [],
    },
    clientID: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const userPoolModel = newModel(mongoose.connection, `${MODELS_PREFIX}_UserPool`, schema);

module.exports = { userPoolModel };

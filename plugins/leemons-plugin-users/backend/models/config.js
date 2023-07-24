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
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const configModel = newModel(mongoose.connection, 'v1::users_Config', schema);

module.exports = { configModel };

// -- Keys --
// jwt-private-key
// platform-locale

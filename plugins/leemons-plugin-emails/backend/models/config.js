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
    //
    userAgent: {
      type: String,
      required: true,
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

const configModel = newModel(mongoose.connection, 'v1::emails_Config', schema);

module.exports = { configModel };

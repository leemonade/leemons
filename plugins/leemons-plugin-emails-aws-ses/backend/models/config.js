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
    name: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    accessKey: {
      type: String,
      required: true,
    },
    secretAccessKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const configModel = newModel(mongoose.connection, 'v1::emails-aws-ses_Config', schema);

module.exports = { configModel };

const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    /*
    Esta configuracion es unica para todos
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    */
    region: {
      type: String,
      required: true,
    },
    accessKeyId: {
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
    minimize: false,
  }
);

const configModel = newModel(mongoose.connection, 'v1::mqtt-aws-iot_Config', schema);

module.exports = { configModel };

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
    // general | center | program
    type: {
      type: String,
      required: true,
    },
    // if general = null, other = center/program id
    typeId: {
      type: String,
    },
    config: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const configModel = newModel(mongoose.connection, 'v1::comunica_Config', schema);

module.exports = { configModel };

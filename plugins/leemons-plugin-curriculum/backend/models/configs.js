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

const configsModel = newModel(mongoose.connection, 'v1::curriculum_Configs', schema);

module.exports = { configsModel };

const { mongoose, newModel } = require('@leemons/mongodb');

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
    pluginName: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    jsonSchema: {
      type: String,
    },
    jsonUI: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const datasetModel = newModel(mongoose.connection, 'v1::dataset_dataset', schema);

module.exports = { datasetModel };

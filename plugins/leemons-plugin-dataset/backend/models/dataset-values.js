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
    pluginName: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    target: {
      type: String,
    },
    key: {
      type: String,
    },
    value: {
      type: String,
    },
    searchableValueString: {
      type: String,
    },
    searchableValueNumber: {
      type: String,
    },
    metadata: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const datasetValuesModel = newModel(mongoose.connection, 'v1::dataset_dataset-values', schema);

module.exports = { datasetValuesModel };

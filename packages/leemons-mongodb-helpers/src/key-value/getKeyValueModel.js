const { mongoose, newModel } = require('@leemons/mongodb');

const keyValueSchema = new mongoose.Schema(
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
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// keyValueSchema.index({ deploymentID: 1, key: 1 }, { unique: true });

function getKeyValueModel({ modelName }) {
  return newModel(mongoose.connection, modelName, keyValueSchema);
}

module.exports = {
  getKeyValueModel,
  keyValueSchema,
};

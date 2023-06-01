const { mongoose, newModel } = require('leemons-mongodb');

function getKeyValueModel({ modelName }) {
  const schema = new mongoose.Schema({
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
  });

  return newModel(mongoose.connection, modelName, schema);
}

module.exports = {
  getKeyValueModel,
};

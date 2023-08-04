const { mongoose, newModel } = require('leemons-mongodb');

function getKeyValueModel({ modelName }) {
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

  return newModel(mongoose.connection, modelName, schema);
}

module.exports = {
  getKeyValueModel,
};

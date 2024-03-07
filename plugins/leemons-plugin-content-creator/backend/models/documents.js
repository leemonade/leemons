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
    content: {
      type: String,
    },
    assignable: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const documentsModel = newModel(mongoose.connection, 'v1::content-creator_Documents', schema);

module.exports = { documentsModel };

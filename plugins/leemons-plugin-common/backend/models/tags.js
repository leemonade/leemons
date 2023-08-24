const { mongoose, newModel } = require('leemons-mongodb');

const tagsSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
    },
    tag: {
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

const tagsModel = newModel(mongoose.connection, 'v1::common_Tags', tagsSchema);

module.exports = { tagsModel, tagsSchema };

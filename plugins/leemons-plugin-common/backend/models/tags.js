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
    type: {
      type: String,
      required: true,
      index: 1,
    },
    tag: {
      type: String,
      required: true,
      index: 1,
    },
    value: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const tagsModel = newModel(mongoose.connection, 'v1::common_Tags', schema);

module.exports = { tagsModel };

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
    provider: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    uri: {
      type: String,
      required: true,
    },
    metadata: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const filesModel = newModel(mongoose.connection, 'v1::leebrary_Files', schema);

module.exports = { filesModel };

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
    uuid: {
      type: String,
      required: true,
      index: true,
    },
    major: {
      type: Number,
      required: true,
    },
    minor: {
      type: Number,
      required: true,
    },
    patch: {
      type: Number,
      required: true,
    },
    published: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const versionsModel = newModel(mongoose.connection, 'v1::common_Versions', schema);

module.exports = { versionsModel };

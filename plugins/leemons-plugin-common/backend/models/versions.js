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
    minimize: false,
  }
);

schema.index({ uuid: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ uuid: 1, published: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ uuid: 1, major: 1, minor: 1, patch: 1, deploymentID: 1, isDeleted: 1 });

const versionsModel = newModel(mongoose.connection, 'v1::common_Versions', schema);

module.exports = { versionsModel };

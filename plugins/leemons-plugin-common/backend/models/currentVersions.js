const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
    },
    published: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, published: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, type: 1, published: 1, deploymentID: 1, isDeleted: 1 });

const currentVersionsModel = newModel(
  mongoose.connection,
  'v1::common_currentVersionsModel',
  schema
);

module.exports = { currentVersionsModel };

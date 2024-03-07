const { mongoose, newModel } = require('@leemons/mongodb');

const contentsSchema = new mongoose.Schema(
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
    key: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

contentsSchema.index({ key: 1, locale: 1, deploymentID: 1, isDeleted: 1 });

const contentsModel = newModel(mongoose.connection, 'v1::multilanguage_Contents', contentsSchema);

module.exports = { contentsModel };

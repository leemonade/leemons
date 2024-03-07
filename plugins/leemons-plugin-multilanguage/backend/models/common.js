const { mongoose, newModel } = require('@leemons/mongodb');

const commonSchema = new mongoose.Schema(
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

commonSchema.index({ key: 1, locale: 1, deploymentID: 1, isDeleted: 1 });

const commonModel = newModel(mongoose.connection, 'v1::multilanguage_Common', commonSchema);

module.exports = { commonModel };

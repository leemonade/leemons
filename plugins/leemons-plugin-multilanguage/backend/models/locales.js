const { mongoose, newModel } = require('@leemons/mongodb');

const localesSchema = new mongoose.Schema(
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
    code: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

localesSchema.index({ deploymentID: 1, code: 1 }, { unique: true });

const localesModel = newModel(mongoose.connection, 'v1::multilanguage_Locales', localesSchema);

module.exports = { localesModel };

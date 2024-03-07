const { mongoose, newModel } = require('@leemons/mongodb');

const globalsSchema = new mongoose.Schema(
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
    plugin: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

globalsSchema.index({ plugin: 1, locale: 1, isDeleted: 1 });

const globalsModel = newModel(mongoose.connection, 'v1::multilanguage_Globals', globalsSchema);

module.exports = { globalsModel };

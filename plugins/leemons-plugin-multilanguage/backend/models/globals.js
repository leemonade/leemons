const { mongoose, newModel } = require('@leemons/mongodb');

const globalsSchema = new mongoose.Schema(
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
    plugin: {
      type: String,
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      index: true,
    },
    locale: {
      type: String,
      required: true,
      index: true,
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

const globalsModel = newModel(mongoose.connection, 'v1::multilanguage_Globals', globalsSchema);

module.exports = { globalsModel };

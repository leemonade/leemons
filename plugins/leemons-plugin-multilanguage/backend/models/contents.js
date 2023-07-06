const { mongoose, newModel } = require('leemons-mongodb');

const contentsSchema = new mongoose.Schema(
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
    key: {
      type: String,
      required: true,
      index: true,
    },
    locale: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const contentsModel = newModel(mongoose.connection, 'multilanguage_Contents', contentsSchema);

module.exports = { contentsModel };

const { mongoose, newModel } = require('leemons-mongodb');

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
      unique: true,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

const localesModel = newModel(mongoose.connection, 'v1::multilanguage_Locales', localesSchema);

module.exports = { localesModel };

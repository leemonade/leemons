const { mongoose, newModel } = require("leemons-mongodb");

const commonSchema = new mongoose.Schema(
  {
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

let commonModel = newModel(
  mongoose.connection,
  "multilanguage_Common",
  commonSchema
);

module.exports = { commonModel };

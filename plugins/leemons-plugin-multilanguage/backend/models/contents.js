const { mongoose, newModel } = require("leemons-mongodb");

const contentsSchema = new mongoose.Schema(
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

let contentsModel = newModel(
  mongoose.connection,
  "multilanguage_Contents",
  contentsSchema
);

module.exports = { contentsModel };

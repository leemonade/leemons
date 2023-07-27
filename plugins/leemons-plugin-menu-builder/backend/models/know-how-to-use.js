const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
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
    //
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ deploymentID: 1, user: 1 }, { unique: true });

const knowHowToUseModel = newModel(mongoose.connection, 'v1::menu-builder_know-how-to-use', schema);

module.exports = { knowHowToUseModel };

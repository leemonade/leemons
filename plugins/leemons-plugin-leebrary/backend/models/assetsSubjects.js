const { mongoose, newModel } = require('leemons-mongodb');

const assetsSubjectsSchema = new mongoose.Schema(
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
    asset: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    level: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const assetsSubjectsModel = newModel(mongoose.connection, 'v1::leebrary_AssetsSubjects', assetsSubjectsSchema);

module.exports = { assetsSubjectsModel, assetsSubjectsSchema };

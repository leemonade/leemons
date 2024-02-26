const { mongoose, newModel } = require('@leemons/mongodb');

const assetsSubjectsSchema = new mongoose.Schema(
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
    minimize: false,
  }
);

assetsSubjectsSchema.index({ asset: 1, deploymentID: 1, isDeleted: 1 });
assetsSubjectsSchema.index({ subject: 1, deploymentID: 1, isDeleted: 1 });
assetsSubjectsSchema.index({ asset: 1, subject: 1, deploymentID: 1, isDeleted: 1 });

const assetsSubjectsModel = newModel(
  mongoose.connection,
  'v1::leebrary_AssetsSubjects',
  assetsSubjectsSchema
);

module.exports = { assetsSubjectsModel, assetsSubjectsSchema };

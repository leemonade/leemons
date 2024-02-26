const { mongoose, newModel } = require('@leemons/mongodb');

const assetsFilesSchema = new mongoose.Schema(
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
    },
    file: {
      // ref: 'plugins_leebrary::files',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

assetsFilesSchema.index({ asset: 1, deploymentID: 1, isDeleted: 1 });
assetsFilesSchema.index({ file: 1, deploymentID: 1, isDeleted: 1 });
assetsFilesSchema.index({ asset: 1, file: 1, deploymentID: 1, isDeleted: 1 });

const assetsFilesModel = newModel(
  mongoose.connection,
  'v1::leebrary_AssetsFiles',
  assetsFilesSchema
);

module.exports = { assetsFilesModel, assetsFilesSchema };

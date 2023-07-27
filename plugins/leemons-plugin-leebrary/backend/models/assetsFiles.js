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
  }
);

const assetsFilesModel = newModel(mongoose.connection, 'v1::leebrary_AssetsFiles', schema);

module.exports = { assetsFilesModel };

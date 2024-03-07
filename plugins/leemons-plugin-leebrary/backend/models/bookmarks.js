const { mongoose, newModel } = require('@leemons/mongodb');

const bookmarksSchema = new mongoose.Schema(
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
    url: {
      type: String,
    },
    icon: {
      // ref: 'plugins_leebrary::files'
      type: String,
    },
    mediaType: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

bookmarksSchema.index({ asset: 1, deploymentID: 1, isDeleted: 1 });
bookmarksSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const bookmarksModel = newModel(mongoose.connection, 'v1::leebrary_Bookmarks', bookmarksSchema);

module.exports = { bookmarksModel, bookmarksSchema };

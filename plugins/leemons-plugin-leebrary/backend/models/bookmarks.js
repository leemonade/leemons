const { mongoose, newModel } = require('leemons-mongodb');

const bookmarksSchema = new mongoose.Schema(
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
    url: {
      type: String,
    },
    icon: {
      // ref: 'plugins_leebrary::files'
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const bookmarksModel = newModel(mongoose.connection, 'v1::leebrary_Bookmarks', bookmarksSchema);

module.exports = { bookmarksModel, bookmarksSchema };

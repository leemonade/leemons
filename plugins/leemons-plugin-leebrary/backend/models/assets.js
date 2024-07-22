const { mongoose, newModel } = require('@leemons/mongodb');

const assetsSchema = new mongoose.Schema(
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
    name: {
      type: String,
      options: {
        notNull: true,
      },
    },
    tagline: {
      type: String,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
    cover: {
      type: String,
    },
    fromUser: {
      // ref: 'plugins_users::users'
      type: String,
    },
    fromUserAgent: {
      // ref: 'plugins_users::user-agent'
      type: String,
    },
    public: {
      type: Boolean,
    },
    category: {
      // ref: 'plugins_leebrary::categories'
      type: String,
    },
    indexable: {
      type: Boolean,
      default: true,
    },
    isCover: {
      type: Boolean,
      default: false,
    },
    center: {
      type: String,
    },
    program: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

assetsSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ id: 1, indexable: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ id: 1, public: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ program: 1, id: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ fromUser: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ category: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ category: 1, indexable: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ category: 1, public: 1, indexable: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ name: 1, indexable: 1, deploymentID: 1, isDeleted: 1 });
assetsSchema.index({ tagline: 1, indexable: 1, deploymentID: 1, isDeleted: 1 });

const assetsModel = newModel(mongoose.connection, 'v1::leebrary_Assets', assetsSchema);

module.exports = { assetsModel, assetsSchema };

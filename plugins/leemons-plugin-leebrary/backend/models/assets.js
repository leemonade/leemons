const { mongoose, newModel } = require('leemons-mongodb');

const assetsSchema = new mongoose.Schema(
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
    center: {
      type: String,
    },
    program: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const assetsModel = newModel(mongoose.connection, 'v1::leebrary_Assets', assetsSchema);

module.exports = { assetsModel, assetsSchema };

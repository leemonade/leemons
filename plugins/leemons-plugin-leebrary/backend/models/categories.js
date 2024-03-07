const { mongoose, newModel } = require('@leemons/mongodb');

const categoriesSchema = new mongoose.Schema(
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
    key: {
      type: String,
      required: true,
    },
    pluginOwner: {
      type: String,
      required: true,
    },
    creatable: {
      type: Boolean,
      default: false,
    },
    createUrl: {
      type: String,
    },
    duplicable: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      required: true,
    },
    componentOwner: {
      type: String,
    },
    listCardComponent: {
      type: String,
    },
    listItemComponent: {
      type: String,
    },
    playerComponent: {
      type: String,
    },
    detailComponent: {
      type: String,
    },
    // Array (stringified) of plugins that can add assets to this category.
    canUse: {
      type: String,
    },
    order: {
      type: Number,
    },
    type: {
      type: String,
      default: 'resource',
      enum: ['activity', 'resource'],
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

categoriesSchema.index({ key: 1, deploymentID: 1, isDeleted: 1 });
categoriesSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const categoriesModel = newModel(mongoose.connection, 'v1::leebrary_Categories', categoriesSchema);

module.exports = { categoriesModel, categoriesSchema };

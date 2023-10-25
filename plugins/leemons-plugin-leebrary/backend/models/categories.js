const { mongoose, newModel } = require('@leemons/mongodb');

const categoriesSchema = new mongoose.Schema(
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
    detailComponent: {
      type: String,
    },
    // Array (stringlificado) de plugins que pueden añadir assets a esta categoria.
    canUse: {
      type: String,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const categoriesModel = newModel(mongoose.connection, 'v1::leebrary_Categories', categoriesSchema);

module.exports = { categoriesModel, categoriesSchema };

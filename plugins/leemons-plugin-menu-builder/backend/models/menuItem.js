const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
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
    menuKey: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    parentKey: {
      type: String,
    },
    pluginName: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
    },
    activeIconName: {
      type: String,
    },
    iconSvg: {
      type: String,
    },
    activeIconSvg: {
      type: String,
    },
    iconAlt: {
      type: String,
    },
    url: {
      type: String,
    },
    // SELF, BLANK, MODAL
    window: {
      type: String,
      default: 'SELF',
    },
    disabled: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

schema.index({ menuKey: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ menuKey: 1, key: 1, deploymentID: 1, isDeleted: 1 });

const menuItemModel = newModel(mongoose.connection, 'v1::menu-builder_menuItem', schema);

module.exports = { menuItemModel };

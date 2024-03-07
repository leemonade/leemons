const { mongoose, newModel } = require('@leemons/mongodb');

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
    order: {
      type: Number,
    },
    isDone: {
      type: Boolean,
    },
    isArchived: {
      type: Boolean,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const kanbanColumnsModel = newModel(mongoose.connection, 'v1::calendar_kanbanColumns', schema);

module.exports = { kanbanColumnsModel };

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
    order: {
      type: Number,
    },
    isDone: {
      type: Boolean,
    },
    isArchived: {
      type: Boolean,
    },
    bgColor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const kanbanColumnsModel = newModel(mongoose.connection, 'v1::calendar_kanban-columns', schema);

module.exports = { kanbanColumnsModel };

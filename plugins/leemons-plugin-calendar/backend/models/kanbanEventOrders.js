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
    // ref: plugins_users::user-agent
    userAgent: {
      type: String,
    },
    // ref: plugins_calendar::kanban-columns
    column: {
      type: String,
    },
    events: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ userAgent: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ userAgent: 1, column: 1, deploymentID: 1, isDeleted: 1 });

const kanbanEventOrdersModel = newModel(
  mongoose.connection,
  'v1::calendar_kanbanEventOrders',
  schema
);

module.exports = { kanbanEventOrdersModel };

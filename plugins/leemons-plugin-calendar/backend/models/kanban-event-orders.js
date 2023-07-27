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
  }
);

const kanbanEventOrdersModel = newModel(
  mongoose.connection,
  'v1::calendar_kanban-event-orders',
  schema
);

module.exports = { kanbanEventOrdersModel };

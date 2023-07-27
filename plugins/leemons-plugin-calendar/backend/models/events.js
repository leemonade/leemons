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
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      /* // Los tasks pueden no tener fecha
      options: {
        notNull: true,
      },
       */
    },
    endDate: {
      type: Date,
      /* // Los tasks pueden no tener fecha
       options: {
         notNull: true,
       },
        */
    },
    isAllDay: {
      type: Boolean,
    },
    repeat: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
    data: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const eventsModel = newModel(mongoose.connection, 'v1::calendar_events', schema);

module.exports = { eventsModel };

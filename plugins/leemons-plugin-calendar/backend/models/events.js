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
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ calendar: 1, deploymentID: 1, isDeleted: 1 });

const eventsModel = newModel(mongoose.connection, 'v1::calendar_events', schema);

module.exports = { eventsModel };

const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
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
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    bgColor: {
      type: String,
      required: true,
    },
    borderColor: {
      type: String,
    },
    section: {
      type: String,
      required: true,
    },
    metadata: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

schema.index({ deploymentID: 1, isDeleted: 1, id: 1 });
schema.index({ deploymentID: 1, isDeleted: 1, key: 1 });

const calendarsModel = newModel(mongoose.connection, 'v1::calendar_calendars', schema);

module.exports = { calendarsModel };

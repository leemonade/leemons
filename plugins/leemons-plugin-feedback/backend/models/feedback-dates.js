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
    instance: {
      type: String,
    },
    startDate: {
      // type: 'datetime',
      type: Date,
    },
    endDate: {
      // type: 'datetime',
      type: Date,
    },
    timeToFinish: {
      type: Number,
    },
    userAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const feedbackDatesModel = newModel(mongoose.connection, 'v1::feedback_feedbackDates', schema);

module.exports = { feedbackModel: feedbackDatesModel };

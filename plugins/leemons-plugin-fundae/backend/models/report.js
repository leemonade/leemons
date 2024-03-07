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
    report: {
      type: mongoose.Schema.Types.Mixed,
    },
    program: {
      type: String,
    },
    percentageCompleted: {
      type: Number,
    },
    course: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    creator: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const reportModel = newModel(mongoose.connection, 'v1::fundae_Report', schema);

module.exports = { reportModel };

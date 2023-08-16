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
    task: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    visualizationDate: {
      type: Date,
    },
    executionTime: {
      type: Number,
    },
    alwaysOpen: {
      type: Boolean,
    },
    closeDate: {
      type: Date,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
    },
    showCurriculum: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const instancesModel = newModel(mongoose.connection, 'v1::tasks_Instances', schema);

module.exports = { instancesModel };

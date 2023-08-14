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
    instance: {
      type: String, // uuid
    },
    user: {
      type: String, // uuid
    },
    opened: {
      type: Date,
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    grade: {
      type: String, // uuid
    },
    teacherFeedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userInstancesModel = newModel(mongoose.connection, 'v1::tasks_UserInstances', schema);

module.exports = { userInstancesModel };

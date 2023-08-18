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
      type: String, // uuid
    },
    major: {
      type: Number,
    },
    minor: {
      type: Number,
    },
    patch: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const tasksVersionsModel = newModel(mongoose.connection, 'v1::tasks_TasksVersions', schema);

module.exports = { tasksVersionsModel };

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
    name: {
      type: String,
    },
    last: {
      type: String,
    },
    current: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const tasksVersioningModel = newModel(mongoose.connection, 'v1::tasks_TasksVersioning', schema);

module.exports = { tasksVersioningModel };

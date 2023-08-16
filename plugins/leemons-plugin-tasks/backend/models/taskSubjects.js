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
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    subject: {
      type: String, // uuid
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const taskSubjectsModel = newModel(mongoose.connection, 'v1::tasks_TaskSubjects', schema);

module.exports = { taskSubjectsModel };

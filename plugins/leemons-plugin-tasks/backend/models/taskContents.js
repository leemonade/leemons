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
    content: {
      type: String,
    },
    subject: {
      type: String, // uuid
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const taskContentsModel = newModel(mongoose.connection, 'v1::tasks_TaskContents', schema);

module.exports = { taskContentsModel };

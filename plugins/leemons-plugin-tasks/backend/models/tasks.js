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
    tagline: {
      type: String,
    },
    level: {
      type: String,
    },
    summary: {
      type: String,
    },
    cover: {
      type: String,
    },
    // TODO: Add cover cropping
    color: {
      type: String,
    },
    methodology: {
      type: String,
    },
    // TODO: Move to string (20min | 20years), because if not, it can overflow
    recommendedDuration: {
      type: Number,
    },
    statement: {
      type: String,
    },
    development: {
      type: String,
    },
    submissions: {
      type: String,
    },
    preTask: {
      type: String,
    },
    preTaskOptions: {
      type: String,
    },
    selfReflection: {
      type: String,
    },
    feedback: {
      type: String,
    },
    instructionsForTeacher: {
      type: String,
    },
    instructionsForStudent: {
      type: String,
    },
    center: {
      type: String, // uuid
    },
    program: {
      type: String, // uuid
    },
    // Track the current state, including setup steps
    state: {
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const tasksModel = newModel(mongoose.connection, 'v1::tasks_Tasks', schema);

module.exports = { tasksModel };

const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      index: true,
    },
    student: {
      type: String,
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    gradedBy: {
      type: String,
      required: true,
    },
    gradedAt: {
      type: Date,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const scoresModel = newModel(mongoose.connection, 'v1::scores_Scores', schema);

module.exports = { scoresModel };

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
    class: {
      type: String,
      // length: 36 * 2 + 1, // uuid.uuid // TODO ask: Ignoramos los length?
    },
    student: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
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
  }
);

const scoresModel = newModel(mongoose.connection, 'v1::scores_Scores', schema);

module.exports = { scoresModel };

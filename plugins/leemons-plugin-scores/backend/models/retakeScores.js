const { mongoose, newModel, leemonsSchemaFields } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    ...leemonsSchemaFields,
    retakeId: {
      type: String,
    },
    retakeIndex: {
      type: Number,
      required: true,
    },
    class: {
      type: String,
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      required: true,
      index: true,
    },
    gradedBy: {
      type: String,
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

const retakeScoresModel = newModel(mongoose.connection, 'v1::scores_RetakeScores', schema);

module.exports = { retakeScoresModel };

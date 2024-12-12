const { mongoose, newModel, leemonsSchemaFields } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    ...leemonsSchemaFields,
    activity: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      required: true,
      index: true,
    },
    class: {
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

schema.index({ activity: 1, user: 1, class: 1 }, { unique: true });

const manualActivityScoresModel = newModel(
  mongoose.connection,
  'v1::scores_ManualActivityScores',
  schema
);

module.exports = { manualActivityScoresModel };

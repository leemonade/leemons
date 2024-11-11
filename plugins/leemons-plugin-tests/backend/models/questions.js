const { mongoose, newModel } = require('@leemons/mongodb');

const formattedTextShape = new mongoose.Schema(
  {
    format: String,
    text: String,
  },
  { _id: false }
);

const choicesShape = new mongoose.Schema(
  {
    text: formattedTextShape,
    feedback: formattedTextShape,
    image: String,
    imageDescription: String,
    isCorrect: Boolean,
    hideOnHelp: Boolean,
  },
  { _id: false }
);

const trueFalsePropertiesSchema = new mongoose.Schema(
  {
    isTrue: Boolean,
  },
  { _id: false }
);

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
    //
    questionBank: {
      // ref: 'plugins_tests::questions-banks',
      type: String,
    },
    type: {
      type: String,
      enum: [
        'mono-response',
        'multi-response',
        'missing-word',
        'map',
        'true-false',
        'short',
        'matching',
        'numerical',
        'open',
        'description',
      ],
      required: true,
    },
    stem: {
      type: formattedTextShape,
      required: true,
    },
    hasEmbeddedAnswers: {
      type: Boolean,
    },
    hasImageAnswers: {
      type: Boolean,
    },
    level: {
      type: String,
    },
    globalFeedback: {
      type: formattedTextShape,
    },
    hasAnswerFeedback: {
      type: Boolean,
    },
    clues: {
      type: [String],
    },
    hasHelp: {
      type: Boolean,
    },
    category: {
      // ref : 'plugins_tests::question-bank-categories',
      type: String,
    },

    stemResource: {
      type: String,
    },

    // Type-specific properties
    choices: {
      type: [choicesShape],
    },
    mapProperties: {
      type: mongoose.Schema.Types.Mixed, // {}
    },
    trueFalseProperties: {
      type: trueFalsePropertiesSchema,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const questionsModel = newModel(mongoose.connection, 'v1::tests_Questions', schema);

module.exports = { questionsModel };

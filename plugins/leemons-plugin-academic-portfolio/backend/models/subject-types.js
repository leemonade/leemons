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
      required: true,
    },
    groupVisibility: {
      type: Boolean,
      required: true,
    },
    program: {
      // ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
    credits_course: {
      type: Number,
    },
    credits_program: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const subjectTypesModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_SubjectTypes',
  schema
);

module.exports = { subjectTypesModel };

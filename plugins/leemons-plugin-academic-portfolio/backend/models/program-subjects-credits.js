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
    program: {
      type: String,
      // ref: 'plugins_academic-portfolio::programs',
    },
    subject: {
      type: String,
      // ref: 'plugins_academic-portfolio::subjects',
    },
    // Curso solo seteado si el internalId tiene especificado un curso
    course: {
      type: String,
      // ref: 'plugins_academic-portfolio::groups',
    },
    credits: {
      type: Number,
    },
    internalId: {
      type: String,
    },
    compiledInternalId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const programSubjectsCreditsModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ProgramSubjectsCredits',
  schema
);

module.exports = { programSubjectsCreditsModel };

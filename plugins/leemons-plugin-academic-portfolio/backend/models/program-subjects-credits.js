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
    // Not used in Academic Portfolio v2.0
    compiledInternalId: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ program: 1, subject: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ subject: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, compiledInternalId: 1, subject: 1, deploymentID: 1, isDeleted: 1 });

const programSubjectsCreditsModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ProgramSubjectsCredits',
  schema
);

module.exports = { programSubjectsCreditsModel };

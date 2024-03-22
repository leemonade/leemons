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
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    center: {
      // ref: 'plugins_users::centers',
      type: String,
    },
    credits_course: {
      type: Number,
    },
    credits_program: {
      type: Number,
    },
    groupVisibility: {
      // Outdated?
      type: Boolean,
      required: true,
      default: false,
    },
    program: {
      // Outdated? ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

schema.index({ program: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, name: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, program: 1, name: 1, deploymentID: 1, isDeleted: 1 });

const subjectTypesModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_SubjectTypes',
  schema
);

module.exports = { subjectTypesModel };

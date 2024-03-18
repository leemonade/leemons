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

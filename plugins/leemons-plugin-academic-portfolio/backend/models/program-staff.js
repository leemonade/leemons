const { mongoose, newModel } = require('@leemons/mongodb');

const { PROGRAM_STAFF_ROLES } = require('../config/constants');

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
      required: true,
    },
    // 'program-director' | 'program-coordinator' | 'lead-instructor' | 'academic-advisor' | 'external-evaluator'
    role: {
      type: String,
      enum: Object.values(PROGRAM_STAFF_ROLES),
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
    collection: 'v1::academic-portfolio_ProgramStaff',
  }
);

schema.index({ relationship: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ relationship: 1, deploymentID: 1, isDeleted: 1 });

const programStaffModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ProgramStaff',
  schema
);

module.exports = { programStaffModel };

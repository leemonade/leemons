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
      // ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
    subjectType: {
      type: String,
      // ref: 'plugins_academic-portfolio::subject-types',
    },
    subject: {
      type: String,
      // ref: 'plugins_academic-portfolio::subjects',
    },
    class: {
      type: String,
      // ref: 'plugins_academic-portfolio::class',
    },
    classroom: {
      type: String,
    },
    seats: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    color: {
      type: String,
    },
    address: {
      type: String,
    },
    virtualUrl: {
      type: String,
    },
    alias: {
      type: String,
    },
    classroomId: {
      type: String,
    },
    classWithoutGroupId: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ subject: 1, program: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ subject: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ class: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const classModel = newModel(mongoose.connection, 'v1::academic-portfolio_Class', schema);

module.exports = { classModel };

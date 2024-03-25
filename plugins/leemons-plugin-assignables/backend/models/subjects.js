const { mongoose, newModel } = require('@leemons/mongodb');

const subjectsSchema = new mongoose.Schema(
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
    assignable: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    level: {
      type: String,
    },
    curriculum: {
      type: mongoose.SchemaTypes.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

subjectsSchema.index({ assignable: 1, deploymentID: 1, isDeleted: 1 });
subjectsSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
subjectsSchema.index({ program: 1, deploymentID: 1, isDeleted: 1 });
subjectsSchema.index({ subject: 1, deploymentID: 1, isDeleted: 1 });

const subjectsModel = newModel(mongoose.connection, 'v1::assignables_Subjects', subjectsSchema);

module.exports = { subjectsModel, subjectsSchema };

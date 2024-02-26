const { mongoose, newModel } = require('@leemons/mongodb');

const classesSchema = new mongoose.Schema(
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
    assignableInstance: {
      type: String,
    },
    assignable: {
      type: String,
    },
    class: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

classesSchema.index({ assignableInstance: 1, deploymentID: 1, isDeleted: 1 });
classesSchema.index({ assignableInstance: 1, class: 1, deploymentID: 1, isDeleted: 1 });
classesSchema.index({ assignable: 1, deploymentID: 1, isDeleted: 1 });
classesSchema.index({ class: 1, deploymentID: 1, isDeleted: 1 });

const classesModel = newModel(mongoose.connection, 'v1::assignables_Classes', classesSchema);

module.exports = { classesSchema, classesModel };

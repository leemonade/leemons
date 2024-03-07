const { mongoose, newModel } = require('@leemons/mongodb');

const datesSchema = new mongoose.Schema(
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
    type: {
      type: String,
    },
    // If type == assignableInstance then instance is the assignableInstanceId
    // If type == assignation then instance is the assignationId
    instance: {
      type: String,
    },
    // type == assignation -> end, open, start
    // type == assignableInstance -> deadline
    name: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

datesSchema.index({ type: 1, instance: 1, deploymentID: 1, isDeleted: 1 });
datesSchema.index({ type: 1, instance: 1, name: 1, deploymentID: 1, isDeleted: 1 });
datesSchema.index({ type: 1, instance: 1, name: 1, date: 1, deploymentID: 1, isDeleted: 1 });
datesSchema.index({ type: 1, name: 1, date: 1, deploymentID: 1, isDeleted: 1 });

const datesModel = newModel(mongoose.connection, 'v1::assignables_Dates', datesSchema);

module.exports = { datesSchema, datesModel };

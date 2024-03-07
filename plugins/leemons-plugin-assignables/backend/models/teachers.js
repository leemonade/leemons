const { mongoose, newModel } = require('@leemons/mongodb');

const teachersSchema = new mongoose.Schema(
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
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

teachersSchema.index({ teacher: 1, deploymentID: 1, isDeleted: 1 });
teachersSchema.index({ assignableInstance: 1, deploymentID: 1, isDeleted: 1 });

const teachersModel = newModel(mongoose.connection, 'v1::assignables_Teachers', teachersSchema);

module.exports = { teachersSchema, teachersModel };

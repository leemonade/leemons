const { mongoose, newModel } = require('leemons-mongodb');

const classesSchema = new mongoose.Schema(
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
  }
);

const classesModel = newModel(mongoose.connection, 'v1::assignables_Classes', classesSchema);

module.exports = { classesSchema, classesModel };

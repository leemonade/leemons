const { mongoose, newModel } = require('leemons-mongodb');

const teachersSchema = new mongoose.Schema(
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
      required: true,
      index: true,
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
  }
);

const teachersModel = newModel(mongoose.connection, 'v1::assignables_Teachers', teachersSchema);

module.exports = { teachersSchema, teachersModel };

const { mongoose, newModel } = require('leemons-mongodb');

const subjectsSchema = new mongoose.Schema(
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
    assignable: {
      type: String,
      required: true,
      index: true,
    },
    program: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
    level: {
      type: String,
    },
    curriculum: {
      type: mongoose.SchemaTypes.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const subjectsModel = newModel(mongoose.connection, 'v1::assignables_Subjects', subjectsSchema);

module.exports = { subjectsModel, subjectsSchema };

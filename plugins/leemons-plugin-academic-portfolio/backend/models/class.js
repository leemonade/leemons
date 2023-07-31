const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const classModel = newModel(mongoose.connection, 'v1::academic-portfolio_Class', schema);

module.exports = { classModel };

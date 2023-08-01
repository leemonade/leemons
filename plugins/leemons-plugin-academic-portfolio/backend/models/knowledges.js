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
    name: {
      type: String,
      required: true,
    },
    abbreviation: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    program: {
      // ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
    credits_course: {
      type: Number,
    },
    credits_program: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const knowledgesModel = newModel(mongoose.connection, 'v1::academic-portfolio_Knowledges', schema);

module.exports = { knowledgesModel };

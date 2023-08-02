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
    program: {
      type: String,
      // ref: 'plugins_academic-portfolio::programs',
    },
    course: {
      type: String,
      // ref: 'plugins_academic-portfolio::groups',
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const subjectsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Subjects', schema);

module.exports = { subjectsModel };

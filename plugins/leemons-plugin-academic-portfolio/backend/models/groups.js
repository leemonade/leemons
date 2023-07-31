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
    },
    abbreviation: {
      type: String,
    },
    index: {
      type: Number,
    },
    program: {
      type: String,
      // ref: 'plugins_academic-portfolio::programs',
    },
    // course / group / substage
    type: {
      type: String,
      required: true,
    },
    // Si es course son los creditos
    // Si es substage es el numero de etapas
    number: {
      type: Number,
    },
    // Only for customSubstages
    frequency: {
      type: String,
    },
    isAlone: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const groupsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Groups', schema);

module.exports = { groupsModel };

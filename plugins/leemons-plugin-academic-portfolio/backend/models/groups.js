const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
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
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, type: 1, isAlone: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, type: 1, abbreviation: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, program: 1, type: 1, abbreviation: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, type: 1, deploymentID: 1, isDeleted: 1 });

const groupsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Groups', schema);

module.exports = { groupsModel };

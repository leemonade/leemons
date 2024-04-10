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
    // Id of type
    relationship: {
      type: String,
    },
    // knowledgeArea | course | group
    type: {
      type: String,
    },
    userAgent: {
      type: String,
      // ref: 'plugins_users::user-agent',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ relationship: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ relationship: 1, deploymentID: 1, isDeleted: 1 });

const managersModel = newModel(mongoose.connection, 'v1::academic-portfolio_Managers', schema);

module.exports = { managersModel };

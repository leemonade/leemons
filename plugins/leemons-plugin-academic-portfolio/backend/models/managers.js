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
    // Id of type
    relationship: {
      type: String,
    },
    // program | course | knowledge | etz
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
  }
);

const managersModel = newModel(mongoose.connection, 'v1::academic-portfolio_Managers', schema);

module.exports = { managersModel };

const { mongoose, newModel } = require('@leemons/mongodb');

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
    //
    name: {
      type: String,
    },
    config: {
      type: String,
    },
    userAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const assignSavedConfigModel = newModel(mongoose.connection, 'v1::tests_AssignSavedConfig', schema);

module.exports = { assignSavedConfigModel };

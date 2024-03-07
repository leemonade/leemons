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
    family: {
      type: String,
      // ref: 'plugins_families::families',
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const emergencyPhonesModel = newModel(
  mongoose.connection,
  'v1::families-emergency-numbers_EmergencyPhones',
  schema
);

module.exports = { emergencyPhonesModel };

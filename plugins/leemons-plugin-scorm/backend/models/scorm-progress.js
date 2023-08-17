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
    //
    instance: {
      type: 'uuid',
    },
    user: {
      type: 'uuid',
    },
    state: {
      type: 'mixed',
    },
  },
  {
    timestamps: true,
  }
);

const scormProgressModel = newModel(mongoose.connection, 'v1::scorm_scormProgress', schema);

module.exports = { scormProgressModel };

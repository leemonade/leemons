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
    group: {
      type: String,
    },
    type: {
      type: String,
    },
    subject: {
      type: String, // uuid
    },
  },
  {
    timestamps: true,
  }
);

const groupsModel = newModel(mongoose.connection, 'v1::tasks_Groups', schema);

module.exports = { groupsModel };

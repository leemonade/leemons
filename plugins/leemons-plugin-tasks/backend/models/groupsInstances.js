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
    instance: {
      type: String, // uuid
    },
    student: {
      type: String, // uuid
    },
  },
  {
    timestamps: true,
  }
);

const groupsInstancesModel = newModel(mongoose.connection, 'v1::tasks_GroupsInstances', schema);

module.exports = { groupsInstancesModel };

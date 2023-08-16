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
    instance: {
      type: String, // uuid
    },
    teacher: {
      type: String, // uuid
    },
  },
  {
    timestamps: true,
  }
);

const teacherInstancesModel = newModel(mongoose.connection, 'v1::tasks_TeacherInstances', schema);

module.exports = { teacherInstancesModel };

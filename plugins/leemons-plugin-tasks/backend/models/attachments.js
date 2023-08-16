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
    task: {
      type: String,
    },
    attachment: {
      type: String, // uuid
    },
  },
  {
    timestamps: true,
  }
);

const attachmentsModel = newModel(mongoose.connection, 'v1::tasks_Attachments', schema);

module.exports = { attachmentsModel };

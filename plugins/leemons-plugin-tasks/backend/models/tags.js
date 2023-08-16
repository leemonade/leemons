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
      type: String, // uuid
    },
    tag: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const tagsModel = newModel(mongoose.connection, 'v1::tasks_Tags', schema);

module.exports = { tagsModel };

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
    user: {
      type: String, // uuid
    },
    deliverable: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userDeliverablesModel = newModel(mongoose.connection, 'v1::tasks_UserDeliverables', schema);

module.exports = { userDeliverablesModel };

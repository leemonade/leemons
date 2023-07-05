const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    uri: {
      type: String,
    },
    indexable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const groupsModel = newModel(mongoose.connection, 'users_Groups', schema);

module.exports = { groupsModel };

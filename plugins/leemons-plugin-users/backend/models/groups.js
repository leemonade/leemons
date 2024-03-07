const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
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
    minimize: false,
  }
);

schema.index({ id: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ name: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ uri: 1, type: 1, deploymentID: 1, isDeleted: 1 });

const groupsModel = newModel(mongoose.connection, 'v1::users_Groups', schema);

module.exports = { groupsModel };

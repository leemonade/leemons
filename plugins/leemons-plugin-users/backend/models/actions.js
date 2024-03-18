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
    actionName: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, actionName: 1 }, { unique: true });

schema.index({ deploymentID: 1, actionName: 1, isDeleted: 1 });

const actionsModel = newModel(mongoose.connection, 'v1::users_Actions', schema);

module.exports = { actionsModel };

const { mongoose, newModel } = require('@leemons/mongodb');

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
    internalName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    asset: {
      type: String,
    },
    url: {
      type: String,
    },
    textUrl: {
      type: String,
    },
    // modal | dashboard | class-dashboard
    zone: {
      type: String,
      required: true,
    },
    // immediately | programmed
    publicationType: {
      type: String,
      required: true,
    },
    // published | programmed | completed | unpublished | archived
    status: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
    },
    userOwner: {
      type: String,
    },
    totalViews: {
      type: Number,
    },
    totalClicks: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const messageConfigModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfig',
  schema
);

module.exports = { messageConfigModel };

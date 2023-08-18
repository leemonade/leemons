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
    key: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    nameReplaces: {
      type: String,
    },
    subName: {
      type: String,
    },
    parentRoom: {
      type: String,
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    bgColor: {
      type: String,
    },
    type: {
      type: String,
    },
    initDate: {
      type: Date,
    },
    useEncrypt: {
      type: Boolean,
    },
    metadata: {
      type: String,
    },
    program: {
      type: String,
    },
    center: {
      type: String,
    },
    adminDisableMessages: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const roomModel = newModel(mongoose.connection, 'v1::comunica_Room', schema);

module.exports = { roomModel };

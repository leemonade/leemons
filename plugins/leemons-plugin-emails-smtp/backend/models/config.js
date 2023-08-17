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
    //
    name: {
      type: String,
      required: true,
    },
    secure: {
      type: Boolean,
    },
    port: {
      type: Number,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    user: {
      type: String,
    },
    pass: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const configModel = newModel(mongoose.connection, 'v1::emails-smtp_Config', schema);

module.exports = { configModel };

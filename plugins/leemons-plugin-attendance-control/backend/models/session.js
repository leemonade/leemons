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
    //
    name: {
      type: String,
    },
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    class: {
      // ref: 'plugins_academic-portfolio::class',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const sessionModel = newModel(mongoose.connection, 'v1::attendance-control_Session', schema);

module.exports = { sessionModel };

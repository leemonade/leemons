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
    student: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
    session: {
      // ref: 'plugins_attendance-control::session',
      type: String,
    },
    // on-time / late / not
    assistance: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const assistanceModel = newModel(mongoose.connection, 'v1::attendance-control_Assistance', schema);

module.exports = { assistanceModel };

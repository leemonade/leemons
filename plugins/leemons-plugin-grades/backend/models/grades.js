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
    type: {
      type: String,
      required: true,
    },
    isPercentage: {
      type: Boolean,
      required: false,
    },
    minScaleToPromote: {
      // ref: 'plugins_grades::grade-scales',
      type: String,
    },
    center: {
      // ref: 'plugins_users::centers',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const gradesModel = newModel(mongoose.connection, 'v1::grades_grades', schema);

module.exports = { gradesModel };

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
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ minScaleToPromote: 1, deploymentID: 1, isDeleted: 1 });

const gradesModel = newModel(mongoose.connection, 'v1::grades_grades', schema);

module.exports = { gradesModel };

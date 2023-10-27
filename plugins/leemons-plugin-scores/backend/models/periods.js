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
    center: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
    },
    course: {
      type: String,
    },
    name: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
    public: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const periodsModel = newModel(mongoose.connection, 'v1::scores_Periods', schema);

module.exports = { periodsModel };

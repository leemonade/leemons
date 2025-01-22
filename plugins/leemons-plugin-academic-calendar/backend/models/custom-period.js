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
    item: {
      type: String, // LRN ID item of the Academic Portfolio entity we want to create a custom period for
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String, // 'Refers to an Academic Portfolio entity: subject, class. It musts coincide with the model name in the LRN ID item'
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const customPeriodModel = newModel(
  mongoose.connection,
  'v1::academic-calendar_CustomPeriod',
  schema
);

module.exports = { customPeriodModel };

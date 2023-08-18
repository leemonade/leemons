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
    // https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Data.md#24-statement-properties
    statement: {
      type: mongoose.Schema.Types.Mixed,
    },
    // log | learning
    type: {
      type: String,
    },
    organization: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const statementModel = newModel(mongoose.connection, 'v1::xapi_Statement', schema);

module.exports = { statementModel };

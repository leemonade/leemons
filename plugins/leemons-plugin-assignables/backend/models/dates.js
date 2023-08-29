const { mongoose, newModel } = require('leemons-mongodb');

const datesSchema = new mongoose.Schema({
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
  type: {
    type: String,
  },
  // If type == assignableInstance then instance is the assignableInstanceId
  // If type == assignation then instance is the assignationId
  instance: {
    type: String,
  },
  // type == assignation -> end, open, start
  // type == assignableInstance -> deadline
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const datesModel = newModel(mongoose.connection, 'v1::assignables_Dates', datesSchema);

module.exports = { datesSchema, datesModel };

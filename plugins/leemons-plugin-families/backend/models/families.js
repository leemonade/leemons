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
    name: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
    },
    nGuardians: {
      type: Number,
      default: 0,
    },
    nStudents: {
      type: Number,
      default: 0,
    },
    nMembers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const familiesModel = newModel(mongoose.connection, 'v1::families_Families', schema);

module.exports = { familiesModel };

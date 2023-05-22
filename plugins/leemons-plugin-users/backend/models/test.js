const { mongoose, newModel } = require("leemons-mongodb");

const testSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let testModel = newModel(mongoose.connection, "users_Test", testSchema);

module.exports = { testModel };

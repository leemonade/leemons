const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 60 * 60, // 1hora,
    },
  },
  { timestamps: true }
);

let Transaction = null;
if (mongoose.connection.models.hasOwnProperty("transaction_Transaction")) {
  Transaction = mongoose.connection.models["transaction_Transaction"];
}
Transaction = connection.model("transaction_Transaction", transactionSchema);

module.exports = { Transaction };

const mongoose = require("mongoose");

const transactionActionSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    transaction: {
      type: mongoose.ObjectId,
      ref: "transaction_Transaction",
    },
    action: {
      type: Boolean,
      default: true,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Name of service
    caller: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 60 * 60, // 1hora,
    },
  },
  { timestamps: true }
);

let TransactionAction = null;
if (
  mongoose.connection.models.hasOwnProperty("transaction_TransactionAction")
) {
  TransactionAction =
    mongoose.connection.models["transaction_TransactionAction"];
}
TransactionAction = connection.model(
  "transaction_TransactionAction",
  transactionActionSchema
);

module.exports = { TransactionAction };

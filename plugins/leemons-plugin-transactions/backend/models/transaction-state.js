const mongoose = require('mongoose');

const transactionStateSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    transaction: {
      type: mongoose.ObjectId,
      ref: 'transaction_Transaction',
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Name of service to call
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

let TransactionState = null;
if (mongoose.connection.models.hasOwnProperty('transaction_TransactionState')) {
  TransactionState = mongoose.connection.models['transaction_TransactionState'];
} else {
  TransactionState = mongoose.connection.model(
    'transaction_TransactionState',
    transactionStateSchema
  );
}

module.exports = { TransactionState };

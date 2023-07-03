const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    pending: {
      type: Number,
      default: 0,
      required: true,
    },
    finished: {
      type: Number,
      default: 0,
      required: true,
    },
    checkNumber: {
      type: Number,
    },
    createdAt: {
      type: Date,
      expires: 60 * 60, // 1hora,
    },
  },
  { timestamps: true }
);

let Transaction = null;
if (mongoose.connection.models.hasOwnProperty('transaction_Transaction')) {
  Transaction = mongoose.connection.models.transaction_Transaction;
} else {
  Transaction = mongoose.connection.model('transaction_Transaction', transactionSchema);
}

module.exports = { Transaction };

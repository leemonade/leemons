module.exports = {
  modelName: 'for-transactions',
  collectionName: 'for-transactions',
  attributes: {},
};
// TODO @askMiguel: como procedemos aquí? Es necesario aún?
// const { mongoose, newModel } = require('leemons-mongodb');

// const schema = new mongoose.Schema(
//   {
//     id: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },
//     deploymentID: {
//       type: String,
//       required: true,
//       index: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const forTransactionsModel = newModel(mongoose.connection, 'v1::learning-paths_ForTransactions', schema);

// module.exports = { forTransactionsModel };

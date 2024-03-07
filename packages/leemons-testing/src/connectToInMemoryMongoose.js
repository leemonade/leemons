const { MongoMemoryServer } = require('mongodb-memory-server-core');
const mongoose = require('mongoose');

async function createMongodProcess() {
  const mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();

  return {
    mongod,
    uri,
    stop: () => mongod.stop(),
  };
}

async function connectMongooseToMongod(uri) {
  const connection = await mongoose.createConnection(uri);

  return { connection, disconnect: () => connection.destroy() };
}

async function createMongooseConnection() {
  const { uri, stop } = await createMongodProcess();

  const { connection, disconnect } = await connectMongooseToMongod(uri);

  return {
    mongoose: connection,
    disconnect: async () => {
      await disconnect();
      await stop();
    },
  };
}

module.exports = {
  createMongodProcess,
  connectMongooseToMongod,
  createMongooseConnection,
};

/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
const { mongoose } = require('@leemons/mongodb');

module.exports = {
  status: {
    rest: {
      method: 'GET',
      path: '/status',
    },
    async handler(ctx) {
      return { status: 200, timestamp: new Date() };
    },
  },

  // restore Database
  ...(process.env.TESTING || process.env.NODE_ENV === 'test' || process.env.testing
    ? {
        restoreDB: {
          dontCreateTransactionOnCallThisFunction: true,
          rest: {
            method: 'POST',
            path: '/database/restore',
          },
          async handler(ctx) {
            try {
              // await dumpCollections(mongoose.connection.db);

              await mongoose.connection.db.dropDatabase();

              return { status: 200, message: 'Successfull Drop Database' };
            } catch (error) {
              ctx.meta.$statusCode = 500;
              return {
                status: 500,
                error: `Restoring Database Error: ${error.message || error}   `,
              };
            }
          },
        },
      }
    : {}),
};

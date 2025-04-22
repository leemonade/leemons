/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
const { mongoose } = require('@leemons/mongodb');

module.exports = {
  statusRest: {
    rest: {
      method: 'GET',
      path: '/status',
    },
    async handler() {
      return { status: 200, timestamp: new Date() };
    },
  },

  // restore Database
  ...(process.env.TESTING || process.env.NODE_ENV === 'test' || process.env.testing
    ? {
        dropDBRest: {
          dontCreateTransactionOnCallThisFunction: true,
          rest: {
            method: 'POST',
            path: '/database/drop',
          },
          async handler(ctx) {
            try {
              const database = mongoose.connection.db;
              const collections = await database.listCollections().toArray();

              for (const collection of collections) {
                if (
                  collection.name.endsWith('_keyvalues') ||
                  collection.name.includes('widgets') ||
                  collection.name.includes('multilanguage') ||
                  collection.name.includes('emails_emailtemplate')
                ) {
                  continue;
                }
                await database.collection(collection.name).deleteMany({});
              }
              return {
                status: 200,
                message: 'Successful Database Drop',
              };
            } catch (error) {
              ctx.meta.$statusCode = 500;
              return {
                status: 500,
                error: `Database Drop Error: ${error.message || error}   `,
              };
            }
          },
        },
      }
    : {}),
};

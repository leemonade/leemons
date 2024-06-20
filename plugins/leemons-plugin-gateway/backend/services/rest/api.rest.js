/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { mongoose } = require('@leemons/mongodb');

const dropDBRest = require('./openapi/gateway/dropDBRest');
const statusRest = require('./openapi/gateway/statusRest');
/** @type {ServiceSchema} */
module.exports = {
  statusRest: {
    openapi: statusRest.openapi,
    rest: {
      method: 'GET',
      path: '/status',
    },
    async handler() {
      return { status: 200, timestamp: new Date() };
    },
  },

  // restore Database
  ...(process.env.TESTING ||
  process.env.NODE_ENV === 'test' ||
  process.env.testing
    ? {
        dropDBRest: {
          openapi: dropDBRest.openapi,
          dontCreateTransactionOnCallThisFunction: true,
          rest: {
            method: 'POST',
            path: '/database/drop',
          },
          async handler(ctx) {
            try {
              await mongoose.connection.db.dropDatabase();
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

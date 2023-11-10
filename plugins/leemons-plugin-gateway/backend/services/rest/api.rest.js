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
  controllers: {
    rest: {
      method: 'GET',
      path: '/controllers',
    },
    params: {
      properties: {
        name: { type: 'number' },
        message: {
          type: 'object',
          properties: { message: { type: ['string', 'boolean'] } },
        },
        arrayParam: { type: 'array', items: { type: 'boolean' } },
      },
      required: ['name', 'array'],
    },
    async handler(ctx) {
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

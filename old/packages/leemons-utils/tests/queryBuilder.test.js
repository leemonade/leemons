const buildQuery = require('../lib/queryBuilder');

describe('QueryBuilder Functions', () => {
  describe('call queryBuilder', () => {
    test.each([
      [
        'no modifier function',
        {
          leemons: {
            db: {
              connectors: {
                getFromConnection: () => ({
                  buildQuery: (...data) => data,
                }),
              },
            },
          },
          model: {
            connection: 'mysql',
          },

          filters: {
            where: [],
            custom: true,
          },

          expectedReturn: [
            {
              connection: 'mysql',
            },
            {
              where: [],
              custom: true,
            },
          ],
        },
      ],
      [
        'no modifier function, no filter',
        {
          leemons: {
            db: {
              connectors: {
                getFromConnection: () => ({
                  buildQuery: (...data) => data,
                }),
              },
            },
          },
          model: {
            connection: 'mysql',
          },

          expectedReturn: [
            {
              connection: 'mysql',
            },
            {},
          ],
        },
      ],
      [
        'modifier function (returns query object)',
        {
          leemons: {
            db: {
              connectors: {
                getFromConnection: () => ({
                  buildQuery: (model, filter) => ({
                    type: 'query',
                    model,
                    params: filter,
                  }),
                }),
              },
            },
          },
          model: {
            connection: 'mysql',
          },

          filters: {
            where: [],
            custom: true,
          },

          rest: ['Im useless', ':D'],

          expectedReturn: {
            type: 'query',
            model: { connection: 'mysql' },
            params: {
              where: [],
              custom: true,
            },
          },
        },
      ],
      [
        'modifier function (returns query object)',
        {
          leemons: {
            db: {
              connectors: {
                getFromConnection: () => ({
                  buildQuery: (model, filter) => ({
                    type: 'query',
                    model,
                    params: filter,
                  }),
                }),
              },
            },
          },
          model: {
            connection: 'mysql',
          },

          filters: {
            where: [],
            custom: true,
          },

          rest: ['Im useless', ':D'],

          expectedReturn: {
            type: 'query',
            model: { connection: 'mysql' },
            params: {
              where: [],
              custom: true,
            },
          },
        },
      ],
      [
        'find given connection modifier function (returns query object)',
        {
          leemons: {
            db: {
              connectors: {
                getFromConnection: (connection) => {
                  if (connection === 'mysql') {
                    return {
                      buildQuery: (model, filter) => ({
                        type: 'query',
                        model,
                        params: filter,
                      }),
                    };
                  }
                  return null;
                },
              },
            },
          },
          model: {
            connection: 'mysql',
          },

          filters: {
            where: [],
            custom: true,
          },

          rest: ['Im useless', ':D'],

          expectedReturn: {
            type: 'query',
            model: { connection: 'mysql' },
            params: {
              where: [],
              custom: true,
            },
          },
        },
      ],
      [
        'find given connection modifier function (returns query object)',
        {
          leemons: {
            db: {
              connectors: {
                getFromConnection: (connection) => {
                  if (connection === 'mongo') {
                    return {
                      buildQuery: (model, filter) => ({
                        type: 'query',
                        model,
                        params: filter,
                      }),
                    };
                  }
                  return null;
                },
              },
            },
          },
          model: {
            connection: 'mongo',
          },

          filters: {
            where: [],
            custom: true,
          },

          rest: ['Im useless', ':D'],

          expectedReturn: {
            type: 'query',
            model: { connection: 'mongo' },
            params: {
              where: [],
              custom: true,
            },
          },
        },
      ],
    ])('with %s', (name, { leemons, model, filters, rest = [], expectedReturn }) => {
      global.leemons = leemons;

      expect(buildQuery(model, filters, ...rest)).toEqual(expectedReturn);
    });
  });
});

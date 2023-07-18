const LeemonsLambdaRunner = require('./lib/runner');

const runner = new LeemonsLambdaRunner();
let broker = null;

function getDoneJSON({ body }) {
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
      'x-powered-by': 'Leemons lambda runner',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

function getErrorJSON(body) {
  return {
    isBase64Encoded: false,
    statusCode: 400,
    headers: {
      'x-powered-by': 'Leemons lambda runner',
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(body),
  };
}

module.exports = {
  async LeemonsLambdaRunner(event, context, callback) {
    try {
      console.log('event', event);
      // Init moleculer broker
      if (!broker) broker = await runner.start();

      // Check if this lambda is called from http or from another lambda
      const { httpMethod } = event;
      let { path } = event;
      if (httpMethod) {
        if (path.startsWith('/')) path = path.slice(1);
        if (!path) {
          callback(null, getErrorJSON({ message: 'No path found' }));
        }

        const actionUrl = `[*]${path}`;
        const actionUrlMethod = `[${httpMethod}]${path}`;

        // TODO Tenemos que soportar urls con parametros /:id
        let action = broker.restUrls[actionUrlMethod];
        if (!action) action = broker.restUrls[actionUrl];

        if (action) {
          callback(
            getDoneJSON({
              body: await broker.call(
                action.name,
                {
                  ...event.body,
                  __isRestApiCall: true,
                },
                {}
              ),
            })
          );
        } else {
          callback(null, getErrorJSON({ message: 'No action for this path found' }));
        }
      }
    } catch (e) {
      console.error('EN EL ERROR', e);
      callback(null, getErrorJSON({ ...e, message: e.message, stack: e.stack }));
    }
  },
};

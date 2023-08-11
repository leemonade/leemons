const { createCredentials } = require('./createCredentials');

/* eslint-disable no-use-before-define */
let client;
let clientExpirationDate;
let clientError;
let creatingClient = false;
let clientTimeout = null;
let onConnectResolve = null;

function waitAndResolveOrReject(resolve, reject) {
  let interval = null;
  let timeout = null;
  // Tiempo maximo de espera para la creación del cliente
  timeout = setTimeout(() => {
    // Si no se a creado en 30 segundos que pete
    clearInterval(interval);
    reject('Timeout to create aws iot client');
  }, 5000);

  // Comprobamos a cada rato que el cliente haya terminado de crearse
  interval = setInterval(() => {
    // Si ha dado error devolvemos el error
    if (clientError) {
      clearTimeout(timeout);
      clearInterval(interval);
      reject(clientError);
    }
    // Si se a creado con exito devolvemos el cliente
    if (!creatingClient) {
      clearTimeout(timeout);
      clearInterval(interval);
      resolve(client);
    }
  }, 1000 / 30);
}

function createClient(credentials) {
  // eslint-disable-next-line new-cap
  return new global.utils.awsIotDeviceSdk.device(credentials);
}

function clearClient() {
  if (client) {
    client.removeListener('connect', clientOnConnect);
    client.removeListener('error', clientOnError);
    client.removeListener('offline', clientOnOffline);
    client.removeListener('close', clientOnClose);
    client.removeListener('reconnect', clientReconnect);
    client.end(true);
    client = undefined;
    if (clientTimeout) {
      clearTimeout(clientTimeout);
      clientTimeout = null;
    }
  }
}

function clientOnError(err) {
  console.error('Backend - Ha ocurrido un error en iot');
  console.error(err);
  creatingClient = false;
  clientError = {
    // eslint-disable-next-line no-nested-ternary
    message: err ? (typeof err === 'string' ? err : err.message) : 'Unable to connect to AWS Iot',
  };
  clearClient();
}
function clientReconnect() {
  console.log('Backend - Iot reconnect');
}
function clientOnOffline() {
  console.error('Backend - Iot offline');
  creatingClient = false;
  clientError = { message: 'Unable to connect to AWS Iot' };
  clearClient();
}
function clientOnClose() {
  console.error('Backend - Iot se a cerrado');
  creatingClient = false;
  clientError = { message: 'Connection with AWS Iot closed' };
  clearClient();
}
function clientOnConnect() {
  console.log('Backend - Conectado a iot correctamente');
  creatingClient = false;
  if (onConnectResolve) onConnectResolve(client);
}

async function getClientCached() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      // Si el cliente esta siendo creado por alguna llamada anterior
      if (creatingClient) {
        // Empezamos a mirar si se a creado el cliente
        waitAndResolveOrReject(resolve, reject);
      } else if (!client) {
        try {
          // Si no esta siendo creado por alguna llamada anterior y aun no existe, lo creamos
          // Reseteamos variables
          creatingClient = true;
          clientError = undefined;

          // Sacamos los credenciales necesarios
          const credentials = await createCredentials({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['iot:*'],
                Resource: '*',
              },
            ],
          });

          clientExpirationDate = new Date(credentials.sessionExpiration);

          // Empezamos a mirar si se a creado el cliente
          waitAndResolveOrReject(resolve, reject);

          // Creamos el cliente
          client = createClient(credentials.connectionConfig);
          onConnectResolve = resolve;
          // Si el cliente consigue conectarse esta si cambia el estado a que el cliente ya ha terminado
          // de crearse para que las peticiones en espera devuelvan el cliente.
          client.on('connect', clientOnConnect);
          // Errores
          client.on('error', clientOnError);
          client.on('offline', clientOnOffline);
          client.on('close', clientOnClose);
          client.on('reconnect', clientReconnect);
        } catch (e) {
          creatingClient = false;
          throw e;
        }
      } else {
        // Si ya existia el cliente comprobamos si no a expirado
        const now = new Date();
        if (now > clientExpirationDate) {
          clearClient();
          getClientCached().then(resolve).catch(reject);
        } else {
          resolve(client);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { getClientCached, clearClient };

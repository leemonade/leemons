const { getIot } = require('./aws');

let endpoint = null;
let endpointDateEnd = null;

async function getEndpointData() {
  const now = new Date();
  if (endpointDateEnd && endpointDateEnd > now) {
    endpoint = null;
  }
  if (endpoint) return endpoint;
  const iot = await getIot();

  return new Promise((resolve, reject) => {
    iot.describeEndpoint({ endpointType: 'iot:Data-ATS' }, (err, data) => {
      if (!err) {
        endpoint = data.endpointAddress;
        // Cacheamos la config durante 15 minutos, por si el token a cambiado.
        endpointDateEnd = new Date();
        endpointDateEnd = new Date(endpointDateEnd.getTime() + 15 * 60000);
        resolve(data.endpointAddress);
      } else {
        reject(err);
      }
    });
  });
}

module.exports = { getEndpointData };

const _ = require("lodash");

async function autoInit(broker) {
  _.forEach(broker.services, (service) => {
    console.log("service", service);
  });
}

module.exports = { autoInit };

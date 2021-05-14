const Transport = require('winston-transport');

module.exports = class EmitToMaster extends Transport {
  // eslint-disable-next-line class-methods-use-this
  log(info, callback) {
    if (process.send) {
      setImmediate(() => {
        process.send({ type: 'log', data: info });
      });
    }
    callback();
  }
};

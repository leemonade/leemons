const _ = require('lodash');

/**
 * Get all the services which are a function and wrap them, so this.calledFrom is added to the call
 */
function transformServices(services, calledFrom, modificable = false) {
  const _services = modificable ? services : _.cloneDeep(services);
  const wrap = (func) =>
    function (...params) {
      return func.call(
        // If the calledFrom is modificable and it already exists on context,
        // use it, if not, use calledFrom
        { calledFrom: modificable && this.calledFrom ? this.calledFrom : calledFrom },
        ...params
      );
    };

  _.forEach(_.keys(services), (serviceKey) => {
    // If the service is a function, call it with custom context
    if (_.isFunction(services[serviceKey])) {
      _services[serviceKey] = wrap(services[serviceKey]);
      // If the service is an object
    } else if (_.isObject(services[serviceKey])) {
      _.forEach(_.keys(services[serviceKey]), (propertyKey) => {
        // Check if the property is a function and call it with custom context
        if (_.isFunction(services[serviceKey][propertyKey])) {
          _services[serviceKey][propertyKey] = wrap(services[serviceKey][propertyKey]);
        }
      });
    }
  });
  return _services;
}

module.exports = transformServices;

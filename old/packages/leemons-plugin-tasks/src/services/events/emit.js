module.exports = function emit(event, data) {
  const events = Array.isArray(event) ? event : [event];
  return events.map((e) => leemons.events.emit(e, data));
};

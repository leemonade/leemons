const eventTypesService = require('./src/services/event-types');

async function install() {
  await eventTypesService.add(leemons.plugin.prefixPN('event'), 'calendar/components/event');
  await eventTypesService.add(leemons.plugin.prefixPN('task'), 'calendar/components/event');
  leemons.events.emit('init-event-types');
}

module.exports = install;

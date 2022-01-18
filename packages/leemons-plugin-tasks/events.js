module.exports = () => {
  leemons.events.on('all', ({ event, target }, data) => {
    if (target === 'plugins.tasks') {
      console.log('Event', event, 'data', data);
    }
  });
};

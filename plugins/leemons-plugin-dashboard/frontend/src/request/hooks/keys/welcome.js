const getWelcomeKey = (userAgent) => [
  {
    plugin: 'plugin.dashboard',
    scope: 'welcome',
    userAgent,
  },
];

export default getWelcomeKey;

export const allUserAgentSubjects = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'user-agent-subjects',
  },
];

export const getUserAgentSubjectsKey = (userAgent, type) => [
  {
    ...allUserAgentSubjects[0],
    userAgent,
    type
  },
];

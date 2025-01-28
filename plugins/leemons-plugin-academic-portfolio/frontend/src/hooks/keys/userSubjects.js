export const allUserAgentSubjects = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'user-agent-subjects',
  },
];

export const getUserAgentSubjectsKey = (userAgent) => [
  {
    ...allUserAgentSubjects[0],
    params: {
      userAgent,
    },
  },
];

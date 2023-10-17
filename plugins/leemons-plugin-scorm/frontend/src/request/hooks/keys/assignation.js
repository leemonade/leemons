export const allAssignationsKey = [
  {
    plugin: 'plugin.scorm',
    scope: 'assignation',
  },
];

export const getAssignationKey = ({ instance, user }) => [
  {
    ...allAssignationsKey,
    action: 'get',
    instance,
    user,
  },
];

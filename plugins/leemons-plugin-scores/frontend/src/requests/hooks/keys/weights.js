export const allWeightsKey = [
  {
    plugin: 'plugin.scores',
    scope: 'weights',
  },
];

export const allGetWeightsKey = [
  {
    ...allWeightsKey[0],
    action: 'get',
  },
];

export const getWeightsKey = ({ class: klass, classes, userAgents }) => [
  {
    ...allGetWeightsKey[0],

    class: klass,
    classes,
    userAgents,
  },
];

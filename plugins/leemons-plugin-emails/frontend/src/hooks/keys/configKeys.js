import { PLUGIN_NAME } from '@emails/config/constants';

const allConfigKey = [
  {
    plugin: `plugin.${PLUGIN_NAME}`,
    scope: 'config',
  },
];

const getConfigKey = () => [
  {
    ...allConfigKey[0],
    action: 'getConfig',
  },
];

const saveConfigKey = ({ data }) => [
  {
    ...allConfigKey[0],
    action: 'saveConfigKey',
    params: {
      data,
    },
  },
];

export { allConfigKey, getConfigKey, saveConfigKey };

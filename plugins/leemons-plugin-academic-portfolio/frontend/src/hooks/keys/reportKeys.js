import { PLUGIN_NAME } from '@academic-portfolio/config/constants';

const allReportsKey = [
  {
    plugin: `plugin.${PLUGIN_NAME}`,
    scope: 'reports',
  },
];

const getColumnsKey = () => [
  {
    ...allReportsKey[0],
    action: 'getColumns',
  },
];

const getDataKey = () => [
  {
    ...allReportsKey[0],
    action: 'getData',
  },
];

export { allReportsKey, getColumnsKey, getDataKey };

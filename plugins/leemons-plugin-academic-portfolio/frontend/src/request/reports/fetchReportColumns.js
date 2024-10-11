import { PLUGIN_NAME } from '@academic-portfolio/config/constants';

function fetchReportColumns() {
  return leemons.api(`v1/${PLUGIN_NAME}/reports/columns`, {
    method: 'GET',
    }
  );
}

export { fetchReportColumns };

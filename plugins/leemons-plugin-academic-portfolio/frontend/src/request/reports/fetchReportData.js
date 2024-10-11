import { PLUGIN_NAME } from '@academic-portfolio/config/constants';

async function fetchReportData({
  locale,
}) {
  const params = new URLSearchParams();
  if (locale) {
    params.append('locale', locale);
  }

  const url = `v1/${PLUGIN_NAME}/reports/data?${params.toString()}`;

  return leemons.api(url, {
    method: 'GET',
  });
}

export { fetchReportData };

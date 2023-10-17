/* eslint-disable no-param-reassign */
import { forIn } from 'lodash';

async function getConfig(programId) {
  const response = await leemons.api(`academic-calendar/config/${programId}`, {
    allAgents: true,
    method: 'GET',
  });
  if (response.config) {
    forIn(response.config.courseDates, (courseDate) => {
      courseDate.startDate = new Date(courseDate.startDate);
      courseDate.endDate = new Date(courseDate.endDate);
    });
  }
  return response;
}

async function saveConfig(body) {
  return leemons.api(`academic-calendar/config`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export { getConfig, saveConfig };

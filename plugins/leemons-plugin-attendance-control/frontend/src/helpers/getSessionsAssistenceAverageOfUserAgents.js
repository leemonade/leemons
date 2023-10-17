/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { getUserAgentIdsFromSessions } from './getUserAgentIdsFromSessions';

export function getSessionsAssistenceAverageOfUserAgents(sessions, userAgentIds) {
  let _userAgentIds = userAgentIds;
  if (!_userAgentIds) {
    _userAgentIds = getUserAgentIdsFromSessions(sessions);
  }
  // Todo: Solo calcular la media de las sessiones que tenemos registro, de las temporales no
  const assistencesByUserAgent = {};
  _.forEach(_userAgentIds, (userAgentId) => {
    assistencesByUserAgent[userAgentId] = {
      value: 0,
      total: sessions.length,
      avg: 0,
    };
  });
  _.forEach(sessions, (session) => {
    if (session.attendance?.length) {
      const asistenceByStudent = _.keyBy(session.attendance, 'student');
      _.forEach(_userAgentIds, (userAgentId) => {
        if (['on-time', 'late'].includes(asistenceByStudent[userAgentId]?.assistance)) {
          assistencesByUserAgent[userAgentId].value++;
        }
      });
    }
  });

  _.forIn(assistencesByUserAgent, (value, key) => {
    assistencesByUserAgent[key].avg = Math.round((value.value / value.total) * 100);
  });
  return assistencesByUserAgent;
}

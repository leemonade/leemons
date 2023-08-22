/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export function getUserAgentIdsFromSessions(sessions) {
  const userAgents = [];
  _.forEach(sessions, (session) => {
    if (session.attendance) {
      _.forEach(session.attendance, ({ student }) => {
        userAgents.push(student);
      });
    }
  });
  return _.uniq(userAgents);
}

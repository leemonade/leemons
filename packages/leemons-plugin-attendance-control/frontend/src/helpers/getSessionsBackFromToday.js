/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export function getSessionsBackFromToday(sessions, n = 5) {
  const now = new Date();
  const old = new Date();
  old.setMonth(old.getMonth() - 2);
  const backSessions = [];
  _.forEach(sessions, (session) => {
    const start = new Date(session.start);
    if (start < now && start > old) {
      backSessions.push(session);
    } else {
      return null;
    }
  });
  return backSessions.slice(
    backSessions.length - n < 0 ? 0 : backSessions.length - n,
    backSessions.length + 1
  );
}

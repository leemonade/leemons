import _ from 'lodash';

export default function getSessionsBackFromToday(sessions, n = 5) {
  const now = new Date();
  const backSessions = [];
  _.forEach(sessions, (session) => {
    if (new Date(session.start) < now) {
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

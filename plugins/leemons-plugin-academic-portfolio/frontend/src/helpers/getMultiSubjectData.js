/* eslint-disable import/prefer-default-export */
export function getMultiSubjectData(labels) {
  return {
    id: 'multiSubject',
    subjectName: labels?.multiSubject,
    groupName: labels?.groupName || labels?.multiSubject,
    name: labels?.groupName || labels?.multiSubject,
    color: '#878D96',
  };
}

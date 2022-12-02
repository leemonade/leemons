import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';

const { classByIdsRequest } = require('@academic-portfolio/request');

export function getMultiClassData(labels) {
  return {
    id: 'multiSubject',
    name: labels?.groupName || labels?.multiSubject,
    icon: '/public/assets/svgs/module-three.svg',
    color: '#67728E',
  };
}
export default async function getClassData(classes, labels = { multiSubject: 'Multi-Subject' }) {
  if (classes.length > 1) {
    return getMultiClassData(labels);
  }

  const klass = classes[0];
  const response = await classByIdsRequest(klass);
  const data = response.classes[0];

  return {
    id: klass,
    name:
      labels?.groupName ||
      `${data?.subject?.name} ${
        data?.groups?.isAlone ? '' : `- ${data?.groups?.name}` || `- ${data?.groups?.abbreviation}`
      }`,
    subjectName: data?.subject?.name,
    groupName: labels?.groupName || data?.groups?.isAlone ? '' : data?.groups?.name,
    icon: getClassIcon(data),
    color: data?.color,
  };
}

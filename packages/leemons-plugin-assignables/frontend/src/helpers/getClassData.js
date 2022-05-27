const { classByIdsRequest } = require('@academic-portfolio/request');

export default async function getClassData(classes, labels = { multiSubject: 'Multi-Subject' }) {
  if (classes.length > 1) {
    return {
      name: labels?.multiSubject,
      icon: '',
      color: '#f5f5f5',
    };
  }

  const klass = classes[0];
  const response = await classByIdsRequest(klass);
  const data = response.classes[0];

  return {
    name: `${data?.subject?.name} - ${data?.groups?.name}` || data?.groups?.abbreviation,
    icon: '',
    color: data?.color,
  };
}

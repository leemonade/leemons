const { classDetailForDashboard } = require('@academic-portfolio/request/classes');

export default async function getClassData(classes, labels = { multiSubject: 'Multi-Subject' }) {
  if (classes.length > 1) {
    return {
      name: labels?.multiSubject,
      icon: '',
      color: '#f5f5f5',
    };
  }

  const klass = classes[0];
  const data = await classDetailForDashboard(klass);

  return {
    name:
      `${data?.classe?.subject?.name} - ${data?.classe?.groups?.name}` ||
      data?.classe?.groups?.abbreviation,
    icon: '',
    color: data?.classe?.color,
  };
}

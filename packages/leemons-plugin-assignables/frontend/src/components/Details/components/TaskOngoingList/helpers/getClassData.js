const { classDetailForDashboard } = require('@academic-portfolio/request/classes');

export default async function getClassData(classes) {
  if (classes.length > 1) {
    return {
      name: 'Multi-Subject',
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

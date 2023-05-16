const form = require('./helpers/forms');
const sqlTemplate = require('./helpers/forms/sqlTemplate');
const routesTemplate = require('./helpers/forms/routesTemplate');

module.exports = async (appName) => {
  const questions = [
    {
      type: 'toggle',
      name: 'customRoutes',
      message: 'Do you want custom routes?',
      enabled: 'Yep',
      disabled: 'Nope',
    },
    {
      type: 'snippet',
      name: 'routes',
      condition: ({ customRoutes }) => customRoutes,
      message: 'Fill custom routes',
      required: true,
      template: routesTemplate,
    },
    {
      type: 'select',
      name: 'sqlOrNoSql',
      message: 'Which database type do you use?',
      choices: ['SQL', 'NoSQL'],
      required: true,
      validate: (value) => {
        if (value === 'NoSQL') {
          return 'Sorry, NoSQL is not yet supported';
        }
        return true;
      },
    },
    {
      type: 'select',
      name: 'sqlEngine',
      condition: ({ sqlOrNoSql }) => sqlOrNoSql === 'SQL',
      message: 'Which database engine do you use?',
      choices: ['MySQL', 'PostgreSQL', 'SQLite3'],
      required: true,
    },
    {
      type: 'snippet',
      name: 'database',
      message: 'Fill database info',
      required: true,
      condition: ({ sqlOrNoSql }) => sqlOrNoSql === 'SQL',
      custom: [
        {
          name: 'template',
          value: sqlTemplate,
        },
      ],
    },
  ];

  if (!appName) {
    questions.unshift({
      type: 'input',
      name: 'appName',
      message: 'What is your project named?',
      validate: (value) => (value ? true : 'Invalid input'),
    });
  }

  const data = { appName, ...(await form(questions)) };

  return data;
};

const form = require('./helpers/forms');
const sqlTemplate = require('./helpers/sqlTemplate');

module.exports = async (appName) => {
  const questions = [
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

  console.log(data);
};

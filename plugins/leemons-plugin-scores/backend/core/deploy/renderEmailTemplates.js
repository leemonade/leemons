const { getEmailTypes } = require('@leemons/emails');
const { render } = require('@react-email/components');

const { default: EvaluationClosed } = require('../../emails/EvaluationClosed.jsx');

async function renderEmailTemplates() {
  return [
    {
      templateName: 'evaluation-closed',
      language: 'es',
      subject: 'Evaluación cerrada',
      html: await render(EvaluationClosed({ locale: 'es' })),
      type: getEmailTypes().active,
    },
    {
      templateName: 'evaluation-closed',
      language: 'en',
      subject: 'Evaluation closed',
      html: await render(EvaluationClosed({ locale: 'en' })),
      type: getEmailTypes().active,
    },
  ];
}

module.exports = { renderEmailTemplates };

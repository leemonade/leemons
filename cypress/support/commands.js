// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('visitInEnglish', (url) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'language', {
        value: 'en-EN',
      });
    },
  });
});

Cypress.Commands.add('getWelcomeTranslations', (language) =>
  cy.request(`/api/admin/i18n/welcome/${language}`).then(({ body }) => body.data[language])
);

Cypress.Commands.add('getTranslations', (keysStartsWith, locale = 'en-EN') =>
  cy
    .request('POST', '/api/multilanguage/common/logged', {
      keys: null,
      keysStartsWith,
      locale,
    })
    .then(({ body }) => body.items)
);

Cypress.Commands.add('restoreDatabase', () => cy.request('/api/database/restore'));

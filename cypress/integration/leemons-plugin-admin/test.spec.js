import tLoader from '../../../packages/leemons-plugin-multilanguage/frontend/src/helpers/tLoader';

const loginUser = (user, password, selector, expectedUrl) => {
  cy.session([user, password], () => {
    cy.visitInEnglish('/');
    cy.get(`${selector} [name="email"]`).type(user);
    cy.get(`${selector} [name="password"]`).type(password);
    cy.get(`${selector} [type="submit"]`).click();
    cy.url().should('include', expectedUrl);
    cy.getCookie('token').should('exist');
  });
};

const advanceWelcomeStep = () => {
  cy.visitInEnglish('/');
  cy.get('[data-cypress-id="nextButton"]').click();
};

describe('leemons-plugin-admin tests', () => {
  describe('Admin can signup', () => {
    const dataWelcome = '[data-cypress-id="welcome"]';
    const dataSignup = '[data-cypress-id="signupForm"]';
    let englishWelcomeTranslations = {};
    let spanishWelcomeTranslations = {};

    before(() => {
      Cypress.session.clearAllSavedSessions();
      cy.restoreDatabase();
      cy.getWelcomeTranslations('en').then((translations) => {
        englishWelcomeTranslations = translations;
      });
      cy.getWelcomeTranslations('es').then((translations) => {
        spanishWelcomeTranslations = translations;
      });
    });

    beforeEach(() => {
      cy.visitInEnglish('/');
    });

    it('Loads the installation page', () => {
      cy.visitInEnglish('/');
      cy.url().should('include', '/admin/welcome');
      cy.get(`${dataWelcome} h3`).contains(englishWelcomeTranslations.title).should('be.visible');
    });

    it('Can change installation language', () => {
      cy.get(`${dataWelcome} input`).last().click();
      cy.get('[role="option"]').contains('Español').click();
      cy.get(`${dataWelcome} h3`).contains(spanishWelcomeTranslations.title).should('be.visible');
    });

    it('Can advance to register', () => {
      cy.get(`${dataWelcome} button`).contains(englishWelcomeTranslations.next).click();
      cy.url().should('include', '/admin/signup');
    });

    it('Can register superadmin', () => {
      cy.get(`${dataSignup} [name="email"]`, { timeout: 10000 }).type('admin@admin.com');
      cy.get(`${dataSignup} [name="password"]`).type('admin');
      cy.get(`${dataSignup} [name="repeatPassword"]`).type('admin');
      cy.get(`${dataSignup} [type="submit"]`).click();
      cy.url().should('include', '/private/admin/setup');
      cy.getCookie('token').should('exist');
    });
  });

  describe('Superadmin configuration', () => {
    const dataLogin = '[data-cypress-id="loginForm"]';

    it('Superadmin can login', () => {
      cy.visitInEnglish('/');
      cy.url().should('include', '/users/login');
      loginUser('admin@admin.com', 'admin', dataLogin, '/private/admin/setup');
      cy.visitInEnglish('/');
      cy.url().should('include', 'private/admin/setup');
    });

    describe('Superadmin can configure organization', () => {
      const dataOrganization = '[data-cypress-id="organizationForm"]';
      const orgName = 'Testorg';
      const hostname = 'http://testorg.org';
      let tOrg = null;

      before(() => {
        cy.getTranslations(['plugins.admin.setup.organization']).then((translations) => {
          tOrg = tLoader('plugins.admin.setup.organization', { items: translations });
        });
      });

      beforeEach(() => {
        loginUser('admin@admin.com', 'admin', dataLogin, '/private/admin/setup');
        advanceWelcomeStep();
      });

      it('Superadmin can not advance without required fields', () => {
        cy.get(`${dataOrganization} [name="name"]`).clear();
        cy.get(`${dataOrganization} [name="hostname"]`).clear();
        cy.get(`${dataOrganization} [name="email"]`).clear();
        cy.get(`${dataOrganization} [type="submit"]`).click();
        cy.get('span').contains(tOrg('organizationNameRequired')).should('be.visible');
        cy.get('span').contains(tOrg('hostnameRequired')).should('be.visible');
        cy.get('span').contains(tOrg('emailRequired')).scrollIntoView().should('be.visible');
      });

      it('Superadmin can not advance with invalid domain URL', () => {
        cy.get(`${dataOrganization} [name="name"]`).clear().type(orgName);
        cy.get(`${dataOrganization} [name="hostname"]`).clear().type('testorg.org');
        cy.get(`${dataOrganization} [type="submit"]`).click();
        cy.get('span').contains(tOrg('hostnameInvalid')).should('be.visible');
      });

      it('Superadmin can configure organization', () => {
        cy.get(`${dataOrganization} [name="name"]`).clear().type(orgName);
        cy.get(`${dataOrganization} [name="hostname"]`).clear().type(hostname);
        cy.get(`${dataOrganization} [type="submit"]`).click();
      });
    });

    describe('Superadmin can configure mail providers', () => {});

    // it('Superadmin can configure providers and email account', () => {
    //   cy.contains('Proveedores y cuentas de correo');
    //   cy.get('.mantine-Input-wrapper input');
    //   cy.get('[alt="emails-smtp"]').click();
    //   cy.get('[name="port"]').type('25');
    //   cy.get('[name="host"]').type('smtp.freesmtpservers.com');
    //   cy.get('.mantine-Button-root').contains('Añadir').click();
    //   cy.get('.mantine-Button-root').contains('Guardar y continuar').click();
    // });
  });
});

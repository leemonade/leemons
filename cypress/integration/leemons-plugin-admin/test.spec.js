import tLoader from '../../../packages/leemons-plugin-multilanguage/frontend/src/helpers/tLoader';

const loginUser = (user, password, selector, expectedUrl) => {
  cy.session([user, password], () => {
    cy.visitInEnglish('/');
    cy.get(`${selector} [name="email"]`).type(user);
    cy.get(`${selector} [name="password"]`).type(password);
    cy.get(`${selector} [type="submit"]`).click();
    cy.url().should('include', expectedUrl);
    cy.wait(1000);
    cy.getCookie('token').should('exist');
  });
};

const advanceWelcomeStep = () => {
  cy.visitInEnglish('/');
  cy.get('[data-cypress-id="nextButton"]').click();
};

const advanceOrganizationStep = (tOrg) => {
  advanceWelcomeStep();
  cy.get('[data-cypress-id="organizationForm"] h3').should('contain', tOrg('title'));
  cy.get('[data-cypress-id="organizationForm"] [type="submit"]').click();
};

const advanceMailStep = (tOrg) => {
  advanceOrganizationStep(tOrg);
  cy.wait(500);
  cy.get('[data-cypress-id="saveMailsButton"]').click();
};

const advanceLocalesStep = (tOrg) => {
  advanceMailStep(tOrg);
  cy.get('[data-cypress-id="saveLocalesButton"]').click();
};

describe('leemons-plugin-admin tests', () => {
  describe('Admin can signup', () => {
    const dataWelcome = '[data-cypress-id="welcome"]';
    const dataSignup = '[data-cypress-id="signupForm"]';
    let englishTranslations = {};
    let spanishTranslations = {};

    before(() => {
      Cypress.session.clearAllSavedSessions();
      cy.restoreDatabase();
      cy.getWelcomeTranslations('en').then((translations) => {
        englishTranslations = translations.welcome;
      });
      cy.getWelcomeTranslations('es').then((translations) => {
        spanishTranslations = translations.welcome;
      });
    });

    beforeEach(() => {
      cy.visitInEnglish('/');
    });

    it('Loads the installation page', () => {
      cy.visitInEnglish('/');
      cy.url().should('include', '/admin/welcome');
      cy.get(`${dataWelcome} h3`).contains(englishTranslations.title).should('be.visible');
    });

    it('Can change installation language', () => {
      cy.get(`${dataWelcome} input`).last().click();
      cy.get('[role="option"]').contains('Español').click();
      cy.get(`${dataWelcome} h3`).contains(spanishTranslations.title).should('be.visible');
    });

    it('Can advance to register', { defaultCommandTimeout: 10000 }, () => {
      cy.url().should('include', '/admin/welcome');
      cy.get(`${dataWelcome} button`).contains(englishTranslations.next).click();
      cy.url().should('include', '/admin/signup');
      cy.wait(8000);
    });

    it('Can fail register', () => {
      cy.getTranslations(['plugins.admin.signup']).then((translations) => {
        englishTranslations.signup = tLoader('plugins.admin.signup', { items: translations });
      });
      cy.then(() => {
        cy.url().should('include', '/admin/signup');
        cy.get(`${dataSignup} [type="submit"]`).click();
        cy.get('span')
          .contains(englishTranslations.signup('errorMessages.email.required'))
          .should('be.visible');
        cy.get('span')
          .contains(englishTranslations.signup('errorMessages.password.required'))
          .should('be.visible');
        cy.get(`${dataSignup} [name="email"]`).type('admin.com');
        cy.get(`${dataSignup} [name="password"]`).type('password1');
        cy.get(`${dataSignup} [name="repeatPassword"]`).type('password2');
        cy.get('span')
          .contains(englishTranslations.signup('errorMessages.email.invalidFormat'))
          .should('be.visible');
        cy.get('span')
          .contains(englishTranslations.signup('errorMessages.password.notMatch'))
          .should('be.visible');
      });
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
    let tOrg = null;
    let tMails = null;
    let tLanguages = null;
    let tLogin = null;
    let tCenters = null;

    before(() => {
      cy.getTranslations([
        'plugins.admin.setup.organization',
        'plugins.admin.setup.mails',
        'plugins.admin.setup.languages',
        'plugins.users.login',
        'plugins.admin.setup.centers',
      ]).then((translations) => {
        tOrg = tLoader('plugins.admin.setup.organization', { items: translations });
        tMails = tLoader('plugins.admin.setup.mails', { items: translations });
        tLanguages = tLoader('plugins.admin.setup.languages', { items: translations });
        tLogin = tLoader('plugins.users.login', { items: translations });
        tCenters = tLoader('plugins.admin.setup.centers', { items: translations });
      });
    });

    it('Superadmin can fail login', () => {
      cy.visitInEnglish('/');
      cy.url().should('include', '/users/login');
      cy.get(`${dataLogin} [type="submit"]`).click();
      cy.get('span').contains('Required field').should('be.visible');
      cy.get(`${dataLogin} [name="email"]`).type('admin');
      cy.get(`${dataLogin} [name="password"]`).type('badpassword');
      cy.get('span').contains('Invalid format').should('be.visible');
      cy.get(`${dataLogin} [name="email"]`).clear().type('admin@admin.com');
      cy.get(`${dataLogin} [type="submit"]`).click();
      cy.get(`${dataLogin} [role="alert"]`).contains(tLogin('form_error')).should('be.visible');
    });

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
      const logoURL = 'http://testorg.org/logourl';
      const contactPhone = '123456789';
      const contactEmail = 'admin@admin.com';
      const contactName = 'Test Name';

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

      it('Superadmin can not advance with invalid fields', () => {
        cy.get(`${dataOrganization} [name="name"]`).clear().type(orgName);
        cy.get(`${dataOrganization} [name="hostname"]`).clear().type('testorg.org');
        cy.get(`${dataOrganization} [name="logoUrl"]`).clear().type('invalid url');
        cy.get(`${dataOrganization} [name="contactEmail"]`).clear().type('admin@admin');
        cy.get(`${dataOrganization} [type="submit"]`).click();
        cy.get('span').contains(tOrg('hostnameInvalid')).should('be.visible');
        cy.get('span').contains(tOrg('logoUrlInvalid')).should('be.visible');
        cy.get('span').contains(tOrg('emailInvalid')).should('be.visible');
      });

      it('Superadmin can configure organization', () => {
        cy.get(`${dataOrganization} [name="name"]`).as('nameInput').clear().type(orgName);
        cy.get(`${dataOrganization} [name="hostname"]`).as('hostInput').clear().type(hostname);
        cy.get(`${dataOrganization} [name="logoUrl"]`).as('logoURL').clear().type(logoURL);
        cy.get(`${dataOrganization} [name="contactPhone"]`)
          .as('contactPhone')
          .clear()
          .type(contactPhone);
        cy.get(`${dataOrganization} [name="contactEmail"]`)
          .as('contactEmail')
          .clear()
          .type(contactEmail);
        cy.get(`${dataOrganization} [name="contactName"]`)
          .as('contactName')
          .clear()
          .type(contactName);
        cy.get(`[data-cypress-id="colorInput"] input`).click();
        cy.get(`[role="slider"]`).click(140, 0);
        cy.wait(500);
        cy.get(`${dataOrganization} [type="submit"]`).click();
        cy.get('[data-cypress-id="mailsForm"] h3').should('contain', tMails('title'));
        advanceWelcomeStep();
        cy.get('@nameInput').should('have.value', orgName);
        cy.get('@hostInput').should('have.value', hostname);
        cy.get(`${dataOrganization} [name="email"]`).should('have.value', 'admin@admin.com');
        cy.get(`[data-cypress-id="colorInput"] input`).should('have.value', '#bf40a8');
        cy.get('@logoURL').should('have.value', logoURL);
        cy.get('@contactPhone').should('have.value', contactPhone);
        cy.get('@contactEmail').should('have.value', contactEmail);
        cy.get('@contactName').should('have.value', contactName);
        cy.get(`${dataOrganization} [type="submit"]`).should(
          'have.css',
          'background-color',
          'rgb(191, 64, 168)'
        );
      });
    });

    describe('Superadmin can configure mail providers', () => {
      const dataMails = '[data-cypress-id="mailsForm"]';
      const dataMailButton = '[data-cypress-id="saveMailsButton"]';
      const orgEmail = 'test@org.org';
      let tProviders = null;

      before(() => {
        cy.getTranslations(['providers.emails-smtp.provider']).then((translations) => {
          tProviders = tLoader('providers.emails-smtp.provider', { items: translations });
        });
      });

      beforeEach(() => {
        loginUser('admin@admin.com', 'admin', dataLogin, '/private/admin/setup');
        advanceOrganizationStep(tOrg);
      });

      it('Superadmin can not advance without mail and provider', () => {
        cy.get(`${dataMails} h3`).first().should('contain', tMails('title'));
        cy.get(`${dataMails} input`).clear();
        cy.get(dataMailButton).click();
        cy.get(`${dataMails} span`).contains(tMails('emailRequired')).should('be.visible');
        cy.get(`[data-cypress-id="mailError"]`)
          .contains(tMails('defaultOrganizationEmailRequired'))
          .should('be.visible');
      });

      it('Superadmin can not advance with invalid email', () => {
        cy.get(`${dataMails} input`).type('test@org');
        cy.get(dataMailButton).click();
        cy.get(`${dataMails} span`).contains(tMails('emailInvalid')).should('be.visible');
        cy.get(`${dataMails} input`).clear().type('testorg.com');
        cy.get(dataMailButton).click();
        cy.get(`${dataMails} span`).contains(tMails('emailInvalid')).should('be.visible');
      });

      it('Superadmin can configure mail providers', () => {
        const dataProvider = '[data-cypress-id="smtpProvider"]';

        cy.get(`${dataMails} input`).clear().type(orgEmail);
        cy.get('[alt="emails-smtp"]').click();
        cy.get(dataProvider).should('contain', tProviders('title'));
        cy.get(`${dataProvider} [name="port"]`).type('25');
        cy.get(`${dataProvider} [name="host"]`).type('smtp.freesmtpservers.com');
        cy.get(`${dataProvider} button`).contains(tProviders('tableAdd')).click();
        cy.get(`${dataProvider} td`).should('contain', '25');
        cy.get(`${dataProvider} td`).should('contain', 'smtp.freesmtpservers.com');
        cy.get(dataMailButton).click();
        cy.get('[data-cypress-id="localesForm"]').should('contain', tLanguages('title'));
        advanceOrganizationStep(tOrg);
        cy.get(`${dataMails} input`).should('have.value', orgEmail);
        cy.get('[alt="emails-smtp"]').click();
        cy.get(`${dataProvider} td`).should('contain', '25');
        cy.get(`${dataProvider} td`).should('contain', 'smtp.freesmtpservers.com');
      });
    });

    describe('Superadmin can configure locales', () => {
      const dataLocales = '[data-cypress-id="localesForm"]';

      beforeEach(() => {
        loginUser('admin@admin.com', 'admin', dataLogin, '/private/admin/setup');
        advanceMailStep(tOrg);
      });

      it('Superadmin can add language', () => {
        cy.get(`${dataLocales} input`).first().next().click();
        cy.get('[role="option"').contains('Español').click();
        cy.get('[type="button"]').contains(tLanguages('add')).click();
        cy.get('[role="cell"]').contains('Español').should('exist');
        cy.get('[data-cypress-id="saveLocalesButton"]').click();
      });

      it('Superadmin can delete language', () => {
        cy.get('[role="cell"]').contains('Español').should('exist');
        cy.get(`[role="row"]`)
          .contains('Español')
          .parent()
          .parent()
          .within(() => {
            cy.get('button').click();
          });
        cy.get('[role="cell"]').contains('Español').should('not.exist');
        cy.get('[data-cypress-id="saveLocalesButton"]').click();
      });

      it('Superadmin can advance to centers', () => {
        cy.get('[role="cell"]').contains('Español').should('not.exist');
        cy.get('[data-cypress-id="saveLocalesButton"]').click();
        cy.get('[data-cypress-id="centersStep"] h3').should('exist');
      });
    });

    describe('Superadmin can configure centers', () => {
      const dataCenters = '[data-cypress-id="centersStep"]';
      const dataCenterForm = '[data-cypress-id="centerForm"]';
      const centerName = 'Test center';
      const centerNotificationsEmail = 'center@notifications.com';
      const centerCity = 'Barcelona';
      const centerPostalCode = '01234';
      const centerStreet = 'Calle Inventada';
      const centerPhone = '012345678';
      const centerContactEmail = 'center@contact.com';
      let tDrawer = null;

      before(() => {
        cy.getTranslations(['plugins.admin.addCenterDrawer']).then((translations) => {
          tDrawer = tLoader('plugins.admin.addCenterDrawer', { items: translations });
        });
      });

      beforeEach(() => {
        loginUser('admin@admin.com', 'admin', dataLogin, '/private/admin/setup');
        advanceLocalesStep(tOrg);
      });

      it('Superadmin can not add a center without requeried fields', () => {
        cy.get(`${dataCenters} button`).contains(tCenters('noCentersYetButton')).click();
        cy.get(`${dataCenterForm} h3`).should('contain', tDrawer('newCenter'));
        cy.get(`[type="submit"]`).click();
        cy.get('span').contains(tDrawer('nameRequired')).should('be.visible');
        cy.get('span').contains(tDrawer('preferredLanguageRequired')).should('be.visible');
        cy.get('span').contains(tDrawer('firstDayOfWeekRequired')).should('be.visible');
        cy.get('span').contains(tDrawer('emailForNotificationsRequired')).should('be.visible');
      });

      // it('Superadmin can add a center', () => {
      //           cy.get(`${dataCenters} button`).contains(tCenters('noCentersYetButton')).click();
      //           cy.get(`${dataCenterForm} h3`).should('contain', tDrawer('newCenter'));
      //           cy.get(`${dataCenterForm} [name="name"]`).type(centerName);
      //           cy.get()
      // })
    });
  });
});

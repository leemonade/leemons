describe('Leemons tests', () => {
  // const loginUser = (user, password) => {
  //   cy.session([user, password], () => {
  //     cy.visit('localhost:8080');
  //     cy.get('[name="email"]').type(user);
  //     cy.get('[name="password"]').type(password);
  //     cy.get('.mantine-Button-root').contains('Entrar').click();
  //     cy.url().should('include', '/admin/setup');
  //   });
  // };

  describe('Leemons can be configured', () => {
    let labels = {};
    beforeEach(() => {
      cy.visitInEnglish('/');
    });
    const dataWelcome = '[data-cypress-id="welcome"]';
    it('Loads the installation page', () => {
      cy.restoreDatabase();
      cy.url().should('include', '/admin/welcome');
      cy.getTranslations('en').then((translations) => {
        labels = translations;
      });
      cy.then(() => cy.get(`${dataWelcome} h3`).contains(labels.title));
    });
    it('Can change installation language', () => {
      let spanishTranslations = {};
      cy.get(`${dataWelcome} input`).last().click();
      cy.get('[role="option"]').contains('Español').click();
      cy.getTranslations('es').then((translations) => {
        spanishTranslations = translations;
      });
      cy.then(() => cy.get(`${dataWelcome} h3`).contains(spanishTranslations.title));
    });
    it('Can advance to register', () => {
      cy.get(`${dataWelcome} button`).contains(labels.next).click();
      cy.url().should('include', '/admin/signup');
      // cy.get('h3').should('contain', 'Registro del Administrador');
    });
    // it('Can register superadmin', () => {
    //   cy.get('[name="email"]').type('admin@admin.com');
    //   cy.get('[name="password"]').type('admin');
    //   cy.get('[name="repeatPassword"]').type('admin');
    //   cy.get('.mantine-Button-root').click();
    //   cy.get('h2').contains('Instalación de Leemons');
    //   cy.url().should('include', '/admin/setup');
    // });
    // describe('Superadmin configuration', () => {
    //   it('Superadmin can login', () => {
    //     loginUser('admin@admin.com', 'admin');
    //   });
    //   it('Superadmin can configure organization', () => {
    //     loginUser('admin@admin.com', 'admin');
    //     cy.visit('localhost:8080/private/admin/setup');
    //     cy.contains('Configuración de la plataforma');
    //     cy.get('.mantine-Button-root').contains('Continuar').click();
    //     cy.contains('URL de la organización');
    //     cy.get('[name="name"]').type('TESTORG', { delay: 50 });
    //     cy.get('[name="hostname"]').type('testorg.com', { delay: 50 });
    //     cy.get('[name="email"]').clear().type('orgemail@org.com', { delay: 50 });
    //     cy.get('[name="password"]').type('admin');
    //     cy.get('.mantine-Button-root').contains('Guardar y continuar').click();
    //   });
    //   it('Superadmin can configure providers and email account', () => {
    //     cy.contains('Proveedores y cuentas de correo');
    //     cy.get('.mantine-Input-wrapper input');
    //     cy.get('[alt="emails-smtp"]').click();
    //     cy.get('[name="port"]').type('25');
    //     cy.get('[name="host"]').type('smtp.freesmtpservers.com');
    //     cy.get('.mantine-Button-root').contains('Añadir').click();
    //     cy.get('.mantine-Button-root').contains('Guardar y continuar').click();
    //   });
    // });
  });
});

describe('Leemons tests', () => {
  const loginUser = (user, password) => {
    cy.session([user, password], () => {
      cy.visit('localhost:8080');
      cy.get('[name="email"]').type(user);
      cy.get('[name="password"]').type(password);
      cy.get('.mantine-Button-root').contains('Entrar').click();
      cy.url().should('include', '/admin/setup');
    });
  };

  describe('Leemons can be configured', () => {
    beforeEach(() => {
      cy.visit('localhost:8080');
    });

    it('Loads the installation page', () => {
      cy.url().should('include', '/admin/welcome');
      cy.get('h3').contains('Instalación de Leemons');
    });

    it('Can change installation language', () => {
      cy.get('.mantine-Select-wrapper input').click();
      cy.get('.mantine-Select-item').contains('English').click();
      cy.get('h3').contains('Leemons installation');
    });

    it('Can advance to register', () => {
      cy.get('.mantine-Button-filled').should('contain', 'Empezar instalación').click();
      cy.url().should('include', '/admin/signup');
      cy.get('h3').should('contain', 'Registro del Administrador');
    });

    it('Can register superadmin', () => {
      cy.get('[name="email"]').type('admin@admin.com');
      cy.get('[name="password"]').type('admin');
      cy.get('[name="repeatPassword"]').type('admin');
      cy.get('.mantine-Button-root').click();
      cy.get('h2').contains('Instalación de Leemons');
      cy.url().should('include', '/admin/setup');
    });

    describe('Superadmin configuration', () => {
      it('Superadmin can login', () => {
        loginUser('admin@admin.com', 'admin');
      });
      it('Superadmin can configure organization', () => {
        loginUser('admin@admin.com', 'admin');
        cy.visit('localhost:8080/private/admin/setup');
        cy.contains('Configuración de la plataforma');
        cy.get('.mantine-Button-root').contains('Continuar').click();
        // cy.contains("URL de la organización");
        // cy.get('[name="name"]').type("TESTORG", { delay: 50 });
        // cy.get('[name="hostname"]').type("testorg.com", { delay: 50 });
        // cy.get('[name="email"]')
        //   .clear()
        //   .type("orgemail@org.com", { delay: 50 });
        // cy.get('[name="password"]').type("admin");
        // cy.get(".mantine-Button-root").contains("Guardar y continuar").click();
      });
      // it("Superadmin can configure providers and email account", () => {
      //   // cy.contains("Proveedores y cuentas de correo");
      //   // cy.get(".mantine-Input-wrapper input");
      //   // cy.get('[alt="emails-smtp"]').click();
      //   // cy.get('[name="port"]').type("25");
      //   // cy.get('[name="host"]').type("smtp.freesmtpservers.com");
      //   // cy.get(".mantine-Button-root").contains("Añadir").click();
      //   // cy.get(".mantine-Button-root").contains("Guardar y continuar").click();
      // });
    });
  });
});

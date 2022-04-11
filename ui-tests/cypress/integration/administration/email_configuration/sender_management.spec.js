import {generateRandomEmail, generateRandomId} from '../../../support/utils';

import {htmlElements} from '../../../support/pageObjects/WebElement';

describe('Sender Management Functionalities', () => {

  beforeEach(() => {
    cy.wrap(null).as('senderToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.get('@currentPage')
      .then(page => page
          .getMenu().getAdministration().open()
          .openEmailConfiguration());
  });

  afterEach(() => {
    cy.get('@senderToBeDeleted').then(sender => {
      if (sender) cy.senderController().then(controller => controller.deleteSender(sender.code));
    });
    cy.kcUILogout();
  });

  describe([Tag.SMOKE, 'ENG-3299'], 'Sender Current Configuration is displayed', () => {

    it([Tag.SMOKE, 'ENG-3299'], 'Table and Button are visible', () => {
      cy.get('@currentPage').then(page => page.getContent().openSenderManagement());
      cy.validateUrlPathname('/email-config/senders');

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getSenderTable().should('be.visible');
          page.getContent().getSenderTableHeaders()
              .children(htmlElements.th).should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Code', 'Email', 'Actions']));
          page.getContent().getAddButton()
              .should('be.visible')
              .and('have.text', 'Add');
        });
    });

    it([Tag.SMOKE, 'ENG-3299'], 'Action Buttons are diplayed', () => {

      addTestSender().then(sender =>
          cy.get('@currentPage')
            .then(page => page.getContent().openSenderManagement())
            .then(page => {
              const kebabMenu = page.getContent().getKebabMenu(sender.code).open();
              kebabMenu.getDropdown().should('be.visible');
              kebabMenu.getEdit()
                       .should('be.visible')
                       .should('have.text', 'Edit');
              kebabMenu.getDelete()
                       .should('be.visible')
                       .should('have.text', 'Delete');
            })
      );
    });

    it([Tag.SMOKE, 'ENG-3299'], 'New Sender is displayed', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => page.getContent().openAddSender());
      cy.validateUrlPathname('/email-config/senders/add');

      cy.get('@currentPage')
        .then(page => {
          page.getContent().getCodeField().should('be.visible');
          page.getContent().getCodeLabel().should('have.text', 'Code ');
          page.getContent().getCodeInput().should('be.visible');

          page.getContent().getEmailField().should('be.visible');
          page.getContent().getEmailLabel().should('have.text', 'Email ');
          page.getContent().getEmailInput().should('be.visible');

          page.getContent().getSaveButton().should('be.visible');
        });
    });

    it([Tag.SMOKE, 'ENG-3299'], 'Edit Sender is displayed', () => {
      addTestSender().then(sender => {
        cy.get('@currentPage')
          .then(page => page.getContent().openSenderManagement())
          .then(page => page.getContent().getKebabMenu(sender.code).open().openEdit());
        cy.validateUrlPathname(`/email-config/senders/edit/${sender.code}`);

        cy.get('@currentPage')
          .then(page => {
            page.getContent().getCodeField().should('be.visible');
            page.getContent().getCodeLabel().should('have.text', 'Code ');
            page.getContent().getCodeInput().should('be.visible');

            page.getContent().getEmailField().should('be.visible');
            page.getContent().getEmailLabel().should('have.text', 'Email ');
            page.getContent().getEmailInput().should('be.visible');

            page.getContent().getSaveButton().should('be.visible');
          });
      });
    });

  });

  describe([Tag.SANITY, 'ENG-3299'], 'Click on Buttons', () => {

    it([Tag.SANITY, 'ENG-3299'], 'Add a new Sender', () => {
      const sender = {
        code: generateRandomId(),
        email: generateRandomEmail()
      };

      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => page.getContent().openAddSender())
        .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, sender.code)))
        .then(page => page.getContent().getEmailInput().then(input => page.getContent().type(input, sender.email)))
        .then(page => page.getContent().save())
        .then(page => {
          cy.validateToast(page);
          cy.wrap(sender).as('senderToBeDeleted');
          page.getContent().getSenderTableRow(sender.code).should('be.visible')
              .children(htmlElements.td).then(cells =>
              cy.validateListTexts(cells, [sender.code, sender.email]));
        });
    });

    it([Tag.SANITY, 'ENG-3299'], 'Update an existing sender', () => {
      const editedEmail = generateRandomEmail();

      addTestSender().then(sender =>
          cy.get('@currentPage')
            .then(page => page.getContent().openSenderManagement())
            .then(page => page.getContent().getKebabMenu(sender.code).open().openEdit())
            .then(page => page.getContent().getEmailInput().then(input => page.getContent().type(input, editedEmail)))
            .then(page => page.getContent().save())
            .then(page => {
              cy.validateToast(page);
              page.getContent().getSenderTableRow(sender.code).should('be.visible')
                  .children(htmlElements.td).then(cells =>
                  cy.validateListTexts(cells, [sender.code, editedEmail]));
            })
      );
    });

    it([Tag.SANITY, 'ENG-3299'], 'Delete Modal is displayed', () => {
      addTestSender().then(sender =>
          cy.get('@currentPage')
            .then(page => page.getContent().openSenderManagement())
            .then(page => {
              page.getContent().getKebabMenu(sender.code).open().clickDelete();
              page.getDialog().get().should('exist');
              page.getDialog().getBody().getStateInfo()
                  .should('be.visible')
                  .should('contain', sender.code);
            })
      );
    });

    it([Tag.SANITY, 'ENG-3299'], 'Click on Cancel Modal Button ', () => {
      addTestSender().then(sender =>
          cy.get('@currentPage')
            .then(page => page.getContent().openSenderManagement())
            .then(page => page.getContent().getKebabMenu(sender.code).open().clickDelete())
            .then(page => page.getDialog().cancel())
            .then(page => {
              page.getDialog().get().should('not.exist');
              page.getContent().getSenderTableRow(sender.code).should('be.visible')
                  .children(htmlElements.td).then(cells =>
                  cy.validateListTexts(cells, [sender.code, sender.email]));
            })
      );
    });

    it([Tag.SANITY, 'ENG-3299'], 'Delete a sender', () => {
      addTestSender().then(sender =>
          cy.get('@currentPage')
            .then(page => page.getContent().openSenderManagement())
            .then(page => page.getContent().getKebabMenu(sender.code).open().clickDelete())
            .then(page => page.getDialog().confirm())
            .then(page => {
              cy.validateToast(page);
              page.getContent().getSenderTable().should('not.contain', sender.code);
              cy.wrap(null).as('senderToBeDeleted');
            })
      );
    });

  });

  describe([Tag.FEATURE, 'ENG-3299'], 'Feature Test', () => {

    it([Tag.FEATURE, 'ENG-3299'], 'No Sender Exist ', () => {
      DEFAULT_SENDERS.forEach(defaultSender =>
          cy.senderController().then(controller => controller.deleteSender(defaultSender.code)));

      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => {
          page.getContent().getSenderTable().should('be.visible');
          page.getContent().getSenderTable().children(htmlElements.tbody).should('not.be.visible');
          DEFAULT_SENDERS.forEach(defaultSender =>
              page.getContent().getSenderTable().should('not.contain', defaultSender.code));
        });

      DEFAULT_SENDERS.forEach(defaultSender =>
          cy.senderController().then(controller => controller.addSender(defaultSender.code, defaultSender.email)));
    });

    it([Tag.FEATURE, 'ENG-3299'], 'Save Button is disabled ', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => page.getContent().openAddSender())
        .then(page => {
          page.getContent().getCodeInput().and('be.empty');
          page.getContent().getEmailInput().and('be.empty');
          page.getContent().getSaveButton().should('be.disabled');
        });
    });

    it([Tag.FEATURE, 'ENG-3299'], 'Code Input is disabled ', () => {
      addTestSender().then(sender => {
        cy.get('@currentPage')
          .then(page => page.getContent().openSenderManagement())
          .then(page => page.getContent().getKebabMenu(sender.code).open().openEdit())
          .then(page => {
            page.getContent().getCodeInput()
                .should('have.value', sender.code)
                .and('be.disabled');
            page.getContent().getEmailInput().should('have.value', sender.email);
            page.getContent().getSaveButton().should('be.enabled');
          });
      });
    });

  });

  describe([Tag.ERROR, 'ENG-3299'], 'Error Validation', () => {

    it([Tag.ERROR, 'ENG-3299'], 'Save Button is disabled when code is empty ', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => page.getContent().openAddSender())
        .then(page => page.getContent().getCodeInput().then(input => {
          page.getContent().focus(input);
          page.getContent().blur(input);
          page.getContent().getInputError(input)
              .should('be.visible')
              .and('have.text', 'Field required');
        }));
    });

    it([Tag.ERROR, 'ENG-3299'], 'Save Button is disabled when email is empty ', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => page.getContent().openAddSender())
        .then(page => page.getContent().getEmailInput().then(input => {
          page.getContent().focus(input);
          page.getContent().blur(input);
          page.getContent().getInputError(input)
              .should('be.visible')
              .and('have.text', 'Field required');
        }));
    });

    it([Tag.ERROR, 'ENG-3299'], 'Invalid value', () => {
      const testInvalidEmail = (page, email) => {
        page.getContent().getEmailInput().then(input => page.getContent().type(input, email));
        page.getContent().getSaveButton().click();
        cy.validateToast(page, 'Invalid sender Email', false);
        return cy.then(() => page);
      };

      cy.get('@currentPage')
        .then(page => page.getContent().openSenderManagement())
        .then(page => page.getContent().openAddSender())
        .then(page => page.getContent().getCodeInput().then(input => page.getContent().type(input, generateRandomId())))
        .then(page => testInvalidEmail(page, 'cypress@entando'))
        .then(page => testInvalidEmail(page, 'cypress@.com'))
        .then(page => testInvalidEmail(page, '@entando.com'))
        .then(page => testInvalidEmail(page, 'cypressentando.com'));
    });

  });

  const DEFAULT_SENDERS = [
    {
      code: 'CODE1',
      email: 'EMAIL1@EMAIL.COM'
    },
    {
      code: 'CODE2',
      email: 'EMAIL2@EMAIL.COM'
    }
  ];

  const addTestSender = () =>
      cy.senderController()
        .then(controller => controller.addSender(generateRandomId(), generateRandomEmail()))
        .then(res => cy.wrap(res.body.payload).as('senderToBeDeleted'));

});

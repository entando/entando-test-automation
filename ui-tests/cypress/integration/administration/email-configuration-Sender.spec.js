import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Sender Management Functionalities', () =>{
    const testCode = 'TestCode';
    const testEmail = 'test@entando.com';
    const defaultCode1 = 'CODE1';
    const defaultEmail1 = 'EMAIL1@EMAIL.COM';
    const defaultCode2 = 'CODE2';
    const defaultEmail2 = 'EMAIL2@EMAIL.COM';
    let currentPage;


    beforeEach(() =>{
       cy.kcLogin('login/admin').as('tokens');
       currentPage = openEmailConfigurationPage();
       currentPage = openSenderPage();
    });

    afterEach(() => {
        
        cy.kcLogout();
      });

    describe([Tag.SMOKE, 'ENG-3299'], 'Sender Current Configuration is displayed', () => {
        

      it([Tag.SMOKE, 'ENG-3299'], 'Table and Button are visible', () => {
        

        cy.validateAppBuilderUrlPathname('/email-config/senders');  
        currentPage.getContent().getSenderTable().should('be.visible');
        currentPage.getContent().getTabHeaders().children(htmlElements.th)
                  .should('have.length', 3)
                  .then(elements => cy.validateListTexts(elements, ['Code', 'Email', 'Actions']));
        currentPage.getContent().getAddButton()
                  .should('be.visible')
                  .and('have.text', 'Add');

      });

      it([Tag.SMOKE, 'ENG-3299'], 'New Sender is displayed', () => {

        currentPage.getContent().getAddButton().click().wait(1000);
        cy.validateAppBuilderUrlPathname('/email-config/senders/add');
        currentPage.getContent().getSenderForm()
                   .should('be.visible')
                   .and('contain', 'Code ')
                   .and('contain', 'Email ');

        currentPage.getContent()
                   .getCodeInput()
                   .should('be.visible')
                   
        currentPage.getContent()
                   .getEmailInput()
                   .should('be.visible');

      });
      it([Tag.SMOKE, 'ENG-3299'], 'Action Buttons are diplayed', () => {
         

        currentPage.getContent().getActionButton(defaultCode1).should('be.visible');

        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getContextMenu().should('be.visible');
        currentPage.getContent().getContextMenu()
                    .contains('Edit')
                    .should('be.visible')
                    .should('have.text','Edit');
        currentPage.getContent().getContextMenu()
                    .contains('Delete')
                    .should('be.visible')
                    .should('have.text','Delete');


      });
      it([Tag.SMOKE, 'ENG-3299'], 'Edit Sender is displayed', () => {


        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getEditButton().click().wait(1000);
        cy.validateAppBuilderUrlPathname('/email-config/senders/edit/CODE1');
        currentPage.getContent().getSenderForm()
                   .should('be.visible')
                   .and('contain', 'Code ')
                   .and('contain', 'Email ');
        currentPage.getContent()
                   .getCodeInput()
                   .should('be.visible')
                   .and('have.value', defaultCode1);
        currentPage.getContent()
                   .getEmailInput()
                   .should('be.visible')
                   .and('have.value', defaultEmail1);


      });




    });

    describe([Tag.SANITY, 'ENG-3299'], 'Click on Buttons', () => {


      it([Tag.SANITY, 'ENG-3299'], 'Add a new Sender', () => {


        currentPage.getContent().getAddButton().click().wait(1000);
        currentPage.getContent()
                   .getCodeInput()
                   .type(testCode);
        currentPage.getContent()
                   .getEmailInput()
                   .clear()
                   .type(testEmail);
        currentPage.getContent().senderSubmit()
                   .click().wait(500);
        currentPage.getContent()
                   .getSenderTable()
                   .contains(testEmail)
                   .should('be.visible');
        cy.validateToast(currentPage);

       cy.senderController()
         .then(controller => controller.deleteSender(testCode)).wait(1000);

      });

      it([Tag.SANITY, 'ENG-3299'], 'Update an existing sender', () => {

        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getEditButton().click().wait(1000);
        cy.validateAppBuilderUrlPathname('/email-config/senders/edit/CODE1');
        currentPage.getContent()
                   .getEmailInput()
                   .clear()
                   .type(testEmail);
        currentPage.getContent().senderSubmit()
                   .click().wait(500);
        currentPage.getContent()
                   .getSenderTable()
                   .contains(testEmail)
                   .should('be.visible');
        cy.validateToast(currentPage);
        cy.senderController()
          .then(controller => controller.defaultEditSender(defaultCode1)).wait(1000);

      });

      it([Tag.SANITY, 'ENG-3299'], 'Delete Modal is displayed', () => {


        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getDeleteButton().click().wait(1000);
        currentPage.getDialog()
                   .get().children(`${htmlElements.div}#DeleteSenderModal`)
                   .should('be.visible');

       });

      it([Tag.SANITY, 'ENG-3299'], 'Delete a sender', () => {


        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getDeleteButton().click().wait(1000);
        currentPage.getDialog().confirm();
        cy.validateToast(currentPage);
        currentPage.getContent()
                   .getSenderTable()
                   .should('not.contain', 'CODE1');
        cy.senderController()
                   .then(controller => controller.addDefaultSender(defaultCode1, defaultEmail1)).wait(1000);


  });
      it([Tag.SANITY, 'ENG-3299'], 'Click on Cancel Modal Button ', () => {

        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getDeleteButton().click().wait(1000);
        currentPage.getDialog().getCancelButton().click();
        currentPage.getContent().getSenderTable().should('contain', 'CODE1');

      });

    });

    describe([Tag.FEATURE, 'ENG-3299'], 'Feature Test', () => {

      /*beforeEach(() =>{
        cy.senderController()
        .then(controller => controller.deleteSender(defaultCode1)).wait(500);
        cy.senderController()
        .then(controller => controller.deleteSender(defaultCode2)).wait(500);});
      afterEach(() =>{
        cy.senderController()
        .then(controller => controller.addSender(defaultCode1, defaultEmail1)).wait(1000);
        cy.senderController()
        .then(controller => controller.addSender(defaultCode2, defaultEmail2)).wait(1000);
      });*/
   
       
      
      it.only([Tag.FEATURE, 'ENG-3299'], 'No Sender Exist ', () => {

        cy.senderController()
          .then(controller => controller.deleteSender(defaultCode1)).wait(500);
        cy.senderController()
          .then(controller => controller.deleteSender(defaultCode2)).wait(500);
       
        currentPage = openSenderPage();
        currentPage.getContent()
                    .getSenderTable()
                    .should('be.visible');
        currentPage.getContent()
                    .getSenderTable()
                    .children(htmlElements.tbody)
                    .should('not.be.visible');
        currentPage.getContent()
                    .getSenderTable()
                    .should('not.contain', 'CODE1');
        currentPage.getContent()
                    .getSenderTable()
                    .should('not.contain', 'CODE2');
        cy.wait(1000);
        cy.senderController()
          .then(controller => controller.addDefaultSender(defaultCode1, defaultEmail1)).wait(1000);
        cy.senderController()
         .then(controller => controller.addDefaultSender(defaultCode2, defaultEmail2)).wait(1000);
               

      });
     
      it.only([Tag.FEATURE, 'ENG-3299'], 'Save Button is disabled ', () => {
         
        currentPage.getContent().getAddButton().click().wait(1000);
        cy.validateAppBuilderUrlPathname('/email-config/senders/add');
        currentPage.getContent().getSenderForm()
                   .should('be.visible');
        currentPage.getContent().senderSubmit()
                  .should('be.disabled');
      
      });


      it.only([Tag.FEATURE, 'ENG-3299'], 'Code Input is disabled ', () => {
      
        
        currentPage.getContent().getActionButton(defaultCode1).click();
        currentPage.getContent().getEditButton().click().wait(1000);
        cy.validateAppBuilderUrlPathname('/email-config/senders/edit/CODE1');
        currentPage.getContent().getSenderForm()
                   .should('be.visible');
        currentPage.getContent().getCodeInput()
                   .should('be.disabled')
                   .and('have.value', 'CODE1');
        currentPage.getContent().getEmailInput()
                   .should('be.visible')
                   .and('have.value', 'EMAIL1@EMAIL.COM');

      });
      

    });

    describe([Tag.ERROR, 'ENG-3299'], 'Error Validation', () => {


      it.only([Tag.ERROR, 'ENG-3299'], 'Save Button is disabled when input is empty ', () => {
        currentPage.getContent().getAddButton().click().wait(1000);
        currentPage.getContent()
                    .getCodeInput()
                    .clear()
                    .blur();
        currentPage.getContent().searchFieldError()
                    .should('be.visible')
                    .and('have.text', 'Field required');
        currentPage.getContent().senderSubmit()
                   .should('be.disabled');

        });
   
      it.only([Tag.ERROR, 'ENG-3299'], 'Invalid value ', () => {

        currentPage.getContent().getAddButton().click().wait(1000);
        currentPage.getContent()
                   .getCodeInput()
                   .type(testCode);
        currentPage.getContent()
                    .getEmailInput()
                    .type('email-at-email.com')
                    .blur();
        currentPage.getContent().senderSubmit().click();
        cy.validateToast(currentPage, 'Invalid sender Email', false);

        });
         

    });




  const openEmailConfigurationPage = () => {

      cy.visit('/');
      currentPage = new HomePage();
      currentPage = currentPage.getMenu().getAdministration().open();
      return currentPage.openEmailConfiguration();
    };

    const openSenderPage = () => {
      cy.visit('/');
      currentPage = new HomePage();
      currentPage = currentPage.getMenu().getAdministration().open();
      currentPage = currentPage.openEmailConfiguration();
      currentPage.getContent().openSender();
      return currentPage;

  };
});

import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Sender Management Functionalities', () =>{
  
  let currentPage;

  beforeEach(() =>{
      cy.wrap(null).as('senderToBeDeleted');

      cy.kcLogin('login/admin').as('tokens');
       
      currentPage = openEmailConfigurationPage();

  });
  afterEach(() => { 

      cy.get('@senderToBeDeleted').then((sender) => {
        if (sender) {
          cy.senderController().then(controller => controller.deleteSender(sender.code));
        }
      });
      cy.kcLogout();

  });

    describe([Tag.SMOKE, 'ENG-3299'], 'Sender Current Configuration is displayed', () => {

        

      it([Tag.SMOKE, 'ENG-3299'], 'Table and Button are visible', () => {
             
        currentPage = openSenderPage();
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
      
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().openAddSender();
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

        addTestSender();
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().getKebabMenu(senderTest.code).open();
        currentPage.getDropdown().should('be.visible');
        currentPage.getDropdown()
                    .contains('Edit')
                    .should('be.visible')
                    .should('have.text','Edit');
        currentPage.getDropdown()
                    .contains('Delete')
                    .should('be.visible')
                    .should('have.text','Delete');

      });
      it.only([Tag.SMOKE, 'ENG-3299'], 'Edit Sender is displayed', () => {

        addTestSender();
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().getKebabMenu(senderTest.code).open().openEdit();
        cy.validateAppBuilderUrlPathname(`/email-config/senders/edit/${senderTest.code}`);
        currentPage.getContent().getSenderForm()
                   .should('be.visible')
                   .and('contain', 'Code ')
                   .and('contain', 'Email ');
        currentPage.getContent()
                   .getCodeInput()
                   .should('be.visible')
                   .and('have.value', senderTest.code);
        currentPage.getContent()
                   .getEmailInput()
                   .should('be.visible')
                   .and('have.value', senderTest.email);

      });

    });

    describe([Tag.SANITY, 'ENG-3299'], 'Click on Buttons', () => {
  
      it([Tag.SANITY, 'ENG-3299'], 'Add a new Sender', () => {


        currentPage = openSenderPage();
        currentPage = currentPage.getContent().openAddSender();
        currentPage.getContent()
                   .getCodeInput()
                   .type(senderTest.code);
        currentPage.getContent()
                   .getEmailInput()
                   .clear()
                   .type(senderTest.email);
        currentPage.getContent().senderSubmit()
                   .click().wait(500);
        cy.validateToast(currentPage);
        cy.wrap(senderTest).as('senderToBeDeleted');
        currentPage = openSenderPage();
        currentPage.getContent()
                   .getSenderTable()
                   .contains(senderTest.email)
                   .should('be.visible');

      });

      it.only([Tag.SANITY, 'ENG-3299'], 'Update an existing sender', () => {

        addTestSender();
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().getKebabMenu(senderTest.code).open().openEdit();
        cy.validateAppBuilderUrlPathname(`/email-config/senders/edit/${senderTest.code}`);
        currentPage.getContent()
                   .getEmailInput()
                   .clear()
                   .type('changes@testmail.com');
        currentPage.getContent().senderSubmit()
                   .click();
        cy.validateToast(currentPage);
        currentPage = openSenderPage();          
        currentPage.getContent()
                   .getSenderTable()
                   .contains('changes@testmail.com')
                   .should('be.visible');

      });

      it([Tag.SANITY, 'ENG-3299'], 'Delete Modal is displayed', () => {

        addTestSender();
        currentPage = openSenderPage();
        currentPage.getContent().getKebabMenu(senderTest.code).open().clickDelete();
        currentPage.getDialog().getBody().getStateInfo().should('exist').and('contain', senderTest.code);

      });

      it([Tag.SANITY, 'ENG-3299'], 'Click on Cancel Modal Button ', () => {

        addTestSender();
        currentPage = openSenderPage();
        currentPage.getContent().getKebabMenu(senderTest.code).open().clickDelete();
        currentPage.getDialog().cancel();
        currentPage.getContent().getSenderTable().should('contain', 'TestCode').and('exist');
        currentPage.getDialog().get().should('not.exist');

      });
      

      it([Tag.SANITY, 'ENG-3299'], 'Delete a sender', () => {

        addTestSender();
        currentPage = openSenderPage();
        currentPage.getContent().getKebabMenu(senderTest.code).open().clickDelete();
        currentPage.getDialog().confirm();
        cy.validateToast(currentPage);
        currentPage.getContent()
                   .getSenderTable()
                   .should('not.contain', 'TestCode');
        cy.wrap(null).as('senderToBeDeleted');

      });
    });

    describe([Tag.FEATURE, 'ENG-3299'], 'Feature Test', () => {

      it([Tag.FEATURE, 'ENG-3299'], 'No Sender Exist ', () => {

        cy.senderController()
          .then(controller => controller.deleteSender(sender1.code)).wait(500);
        cy.senderController()
          .then(controller => controller.deleteSender(sender2.code)).wait(500);
       
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
          .then(controller => controller.addSender(sender1.code, sender1.email)).wait(1000);
        cy.senderController()
         .then(controller => controller.addSender(sender2.code, sender2.email)).wait(1000);
               
      });
     
      it([Tag.FEATURE, 'ENG-3299'], 'Save Button is disabled ', () => {
         
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().openAddSender();
        cy.validateAppBuilderUrlPathname('/email-config/senders/add');
        currentPage.getContent().getSenderForm()
                   .should('be.visible');
        currentPage.getContent().senderSubmit()
                  .should('be.disabled');
      
      });

      it.only([Tag.FEATURE, 'ENG-3299'], 'Code Input is disabled ', () => {
      
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().getKebabMenu(sender1.code).open().openEdit();
        cy.validateAppBuilderUrlPathname(`/email-config/senders/edit/${sender1.code}`);
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

      
      it([Tag.ERROR, 'ENG-3299'], 'Save Button is disabled when input is empty ', () => {
        
        currentPage = openSenderPage();
        currentPage = currentPage.getContent().openAddSender();
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
   
      it([Tag.ERROR, 'ENG-3299'], 'Invalid value ', () => {

        currentPage = openSenderPage();
        currentPage = currentPage.getContent().openAddSender();
        currentPage.getContent()
                   .getCodeInput()
                   .type(senderTest.code);
        currentPage.getContent()
                    .getEmailInput()
                    .type('email-at-email.com')
                    .blur();
        currentPage.getContent().senderSubmit().click();
        cy.validateToast(currentPage, 'Invalid sender Email', false);

        });
         

    });

    const addTestSender = () => {
      cy.senderController()
        .then(controller => controller.addSender(senderTest.code, senderTest.email))
        .then(res => cy.wrap(res.body.payload).as('senderToBeDeleted'));
    };


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
    const senderTest ={
      code: 'TestCode',
      email: 'test@entando.com'
    };
    
    const sender1 = {
      code:'CODE1',
      email:'EMAIL1@EMAIL.COM'
    };

    const sender2 = {
      code: 'CODE2',
      email: 'EMAIL2@EMAIL.COM'
    };
  
  
});

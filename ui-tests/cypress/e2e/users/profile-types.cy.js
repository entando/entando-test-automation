import {generateRandomId, generateRandomTypeCode} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Profile Types', () => {

  beforeEach(() => {
    cy.wrap({code: generateRandomTypeCode(), name: generateRandomId()}).as('profileType');
    cy.wrap(null).as('profileTypeToBeDeleted');
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@profileTypeToBeDeleted').then(code => {
      if (code) deleteProfileType(code);
    });
    cy.kcUILogout();
  });

  it([Tag.GTS, 'ENG-2523'], 'Add a new profile type', () => {
    cy.get('@profileType').then(profileType => {
      openProfileTypesPage()
      .then(page => {
        cy.log(`Add profile type with code ${profileType.code}`);
        page.getContent().openAddProfileTypePage();
      })
      .then(page => {
        cy.validateUrlPathname('/profiletype/add');
        page.getContent().addAndSaveProfileType(profileType.code, profileType.name);
      })
      .then(page => {
        cy.validateUrlPathname(`/profiletype/edit/${profileType.code}`);
        cy.wrap(profileType.code).as('profileTypeToBeDeleted');
        page.getContent().getCodeInput().should('have.value', profileType.code).and('be.disabled');
        page.getContent().getNameInput().should('have.value', profileType.name);
        page.getContent().save();
      })
      .then(page => {
        cy.validateUrlPathname('/profiletype');
        page.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(0).should('contain.text', profileType.name);
        page.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(1).should('contain.text', profileType.code);
      });
    });
  });

  it([Tag.GTS, 'ENG-2523'], 'Edit profile type', () => {
    cy.get('@profileType').then(profileType => {
      addProfileType(profileType.code, profileType.name);

      cy.wrap(generateRandomId()).then(newProfileTypeName => {
        openProfileTypesPage()
        .then(page => {
          cy.log(`Edit profile type with code ${profileType.code}`);
          page.getContent().getKebabMenu(profileType.code).open().openEdit();
        })
        .then(page => {
          cy.validateUrlPathname(`/profiletype/edit/${profileType.code}`);
          page.getContent().getNameInput().then(input => page.getContent().type(input, newProfileTypeName));
          page.getContent().save();
        })
        .then(page => {
          cy.validateUrlPathname('/profiletype');
          page.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(0).should('contain.text', newProfileTypeName);
        });
      });
    });
  });

  it([Tag.GTS, 'ENG-2523'], 'Delete profile type', () => {
    cy.get('@profileType').then(profileType => {
      addProfileType(profileType.code, profileType.name);
      openProfileTypesPage()
        .then(page => {
          cy.log(`Delete profile type with code ${profileType.code}`);
          page.getContent().getKebabMenu(profileType.code).open().clickDelete();
          page.getDialog().confirm();
          page.getContent().getTable().should('not.contain', profileType.code);
          cy.wrap(null).as('profileTypeToBeDeleted');
        });
    });
  });

  const addProfileType = (code, name) => {
    cy.profileTypesController().then(controller => controller.addProfileType(code, name))
      .then(response => cy.wrap(response.body.payload.code).as('profileTypeToBeDeleted'));
  };

  const deleteProfileType = (code) => cy.profileTypesController().then(controller => controller.deleteProfileType(code));

  const openProfileTypesPage = () => cy.get('@currentPage').then(page => page.getMenu().getUsers().open().openProfileTypes());

});

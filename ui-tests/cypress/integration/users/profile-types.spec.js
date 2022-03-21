import {generateRandomId, generateRandomTypeCode} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage.js';

describe([Tag.GTS], 'Profile Types', () => {

  let currentPage;
  const profileType = {};

  beforeEach(() => {
    profileType.code = generateRandomTypeCode();
    profileType.name = generateRandomId();
    cy.wrap(null).as('profileTypeToBeDeleted');
    cy.kcAPILogin();
    cy.profileTypesController().then(controller => controller.intercept({method: 'GET'}, 'loadedList', 'Status'));
    cy.profileTypesController().then(controller => controller.intercept({method: 'POST'}, 'addedProfileType'));
    cy.profileTypesController().then(controller => controller.intercept({method: 'DELETE'}, 'deletedProfileType', `/${profileType.code}`));
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@profileTypeToBeDeleted').then(code => {
      if (code) deleteProfileType(code);
    });
    cy.kcUILogout();
  });

  it('Add a new profile type', () => {
    currentPage = openProfileTypesPage();

    cy.log(`Add profile type with code ${profileType.code}`);
    currentPage = currentPage.getContent().openAddProfileTypePage();
    cy.validateAppBuilderUrlPathname('/profiletype/add');
    currentPage = currentPage.getContent().addAndSaveProfileType(profileType.code, profileType.name);

    cy.wait('@addedProfileType').then(res => cy.wrap(res.response.body.payload.code).as('profileTypeToBeDeleted'));
    cy.validateAppBuilderUrlPathname(`/profiletype/edit/${profileType.code}`);

    currentPage.getContent().getCodeInput().should('have.value', profileType.code).and('be.disabled');
    currentPage.getContent().getNameInput().should('have.value', profileType.name);

    currentPage = currentPage.getContent().save();
    cy.validateAppBuilderUrlPathname('/profiletype');
    cy.wait('@loadedList');

    currentPage.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(0).should('contain.text', profileType.name);
    currentPage.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(1).should('contain.text', profileType.code);
  });

  it('Edit profile type', () => {
    addProfileType(profileType.code, profileType.name);
    currentPage = openProfileTypesPage();

    cy.log(`Edit profile type with code ${profileType.code}`);
    openKebabMenu(profileType.code);
    currentPage = currentPage.getContent().getKebabMenu(profileType.code).openEdit();
    cy.validateAppBuilderUrlPathname(`/profiletype/edit/${profileType.code}`);
    const newProfileTypeName = generateRandomId();
    currentPage.getContent().clearName();
    currentPage.getContent().typeName(newProfileTypeName);
    currentPage = currentPage.getContent().save();
    cy.validateAppBuilderUrlPathname('/profiletype');
    cy.wait('@loadedList');
    currentPage.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(0).should('contain.text', newProfileTypeName);
  });

  it('Delete profile type', () => {
    addProfileType(profileType.code, profileType.name);
    currentPage = openProfileTypesPage();

    cy.log(`Delete profile type with code ${profileType.code}`);
    openKebabMenu(profileType.code);
    currentPage.getContent().getKebabMenu(profileType.code).clickDelete();
    currentPage.getDialog().confirm();
    currentPage.getContent().getTable().should('not.contain', profileType.code);
    cy.wait('@deletedProfileType').its('response.statusCode').should('eq', 200);
    cy.wrap(null).as('profileTypeToBeDeleted');
  });

  const addProfileType = (code, name) => {
    cy.profileTypesController().then(controller => controller.addProfileType(code, name))
      .then(response => cy.wrap(response.body.payload.code).as('profileTypeToBeDeleted'));
  };

  const deleteProfileType = (code) => cy.profileTypesController().then(controller => controller.deleteProfileType(code));

  const openProfileTypesPage = () => {
    let currentPage = new HomePage();
    currentPage     = currentPage.getMenu().getUsers().open();
    currentPage     = currentPage.openProfileTypes();
    cy.validateAppBuilderUrlPathname('/profiletype');
    cy.wait('@loadedList');
    return currentPage;
  };

  const openKebabMenu = (code) => {
    const click = $el => $el.click();

    let page = currentPage.getContent().getKebabMenu(code);

    page.get().children(htmlElements.ul).should('not.be.visible')
        .siblings(htmlElements.button)
        .pipe(click)
        .should($el => {
          expect($el.siblings(htmlElements.ul)).to.be.visible;
        });
  };

});

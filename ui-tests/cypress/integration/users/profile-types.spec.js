import {generateRandomId, generateRandomTypeCode} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage.js';

const addProfileType    = (code, name) => cy.profileTypesController().then(controller => controller.addProfileType(code, name));
const deleteProfileType = (code) => cy.profileTypesController().then(controller => controller.deleteProfileType(code));

const openProfileTypesPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage     = currentPage.getMenu().getUsers().open();
  return currentPage.openProfileTypes();
};

describe('Profile Types', () => {

  let currentPage;
  const profileType = {};

  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');

    profileType.code = generateRandomTypeCode();
    profileType.name = generateRandomId();
  });

  afterEach(() => cy.kcLogout());

  it('Add a new profile type', () => {
    currentPage = openProfileTypesPage();

    cy.log(`Add profile type with code ${profileType.code}`);
    currentPage = currentPage.getContent().openAddProfileTypePage();
    currentPage = currentPage.getContent().addAndSaveProfileType(profileType.code, profileType.name);
    currentPage.getContent().getCodeInput().should('have.value', profileType.code).and('be.disabled');
    currentPage.getContent().getNameInput().should('have.value', profileType.name);

    currentPage = currentPage.getContent().save();
    currentPage.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(0).should('contain.text', profileType.name);
    currentPage.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(1).should('contain.text', profileType.code);

    deleteProfileType(profileType.code);
  });

  it('Edit profile type', () => {
    addProfileType(profileType.code, profileType.name);
    currentPage = openProfileTypesPage();

    cy.log(`Edit profile type with code ${profileType.code}`);
    currentPage = currentPage.getContent().getKebabMenu(profileType.code).open().openEdit();
    const newProfileTypeName = generateRandomId();
    //currentPage.getContent().checkPageIsLoaded(profileType.name); //to fix the need to wait for the edit page to load
    currentPage.getContent().clearName();
    currentPage.getContent().typeName(newProfileTypeName);
    currentPage = currentPage.getContent().save();
    currentPage.getContent().getTableRow(profileType.code).find(htmlElements.td).eq(0).should('contain.text', newProfileTypeName);

    deleteProfileType(profileType.code);
  });

  it('Delete profile type', () => {
    addProfileType(profileType.code, profileType.name);
    currentPage = openProfileTypesPage();

    cy.log(`Delete profile type with code ${profileType.code}`);
    currentPage.getContent().getKebabMenu(profileType.code).open().clickDelete();
    currentPage.getDialog().confirm();
    currentPage.getContent().getTable().should('not.contain', profileType.code);
  });
});

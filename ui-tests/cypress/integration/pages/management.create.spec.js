import HomePage             from "../../support/pageObjects/HomePage";
import { generateRandomId } from '../../support/utils';

let currentPage;

const openManagementPage = () => {
    cy.visit('/');
    let currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
}

const OOTB_PAGE_TEMPLATES = ['1-2-column', '1-2x2-1-column', '1-2x4-1-column', '1-column', 'content-page', 'home', 'single_frame_page']

describe('Pages Management - Create', () => {
    beforeEach(() => {
        cy.kcLogin("admin").as("tokens");
    });

    afterEach(() => {
        cy.kcLogout();
    });

  it('Create a page for every OOTB page-template', () => {
    currentPage = openManagementPage();

    OOTB_PAGE_TEMPLATES.forEach(template => {
        const code = generateRandomId();
        const friendlyCode = generateRandomId();

        // go to add page
        currentPage = currentPage.getContent().clickAddButton();

        currentPage.getContent()
            .fillRequiredData(`${template} - test en`, `${template} - test it`, code, 0, template);

        currentPage.getContent().fillSeoData('SEO description', 'keyword', friendlyCode);

        currentPage = currentPage.getContent().clickSaveButton();

        cy.wait(2000);
        // page should be created successfully
        currentPage.getContent().getTableRows().should('contain', `${template} - test en`);

        // delete recently added page
        cy.pagesController().then(controller => controller.deletePage(code));
    });
  });

  it('create a page with empty SEO data', () => {
    currentPage = openManagementPage();

    const code = generateRandomId();
    const name = 'empty SEO data';

    // go to add page
    currentPage = currentPage.getContent().clickAddButton();

    currentPage.getContent()
        .fillRequiredData(name, name, code, 0, OOTB_PAGE_TEMPLATES[0]);

    currentPage = currentPage.getContent().clickSaveButton();

    cy.wait(1000);
    // page should be created successfully
    currentPage.getContent().getTableRows().should('contain', name);

    // delete recently added page
    cy.pagesController().then(controller => controller.deletePage(code));
    cy.wait(1000);
  });

  it('should not create a page with empty fields', () => {
    currentPage = openManagementPage();

    // go to add page
    currentPage = currentPage.getContent().clickAddButton();

    // save buttons should be disabled without mandatory fields
    currentPage.getContent().getSaveButton().should('be.disabled');
    currentPage.getContent().getSaveAndDesignButton().should('be.disabled');
  });

  it('should not create a page with missing required field', () => {
    currentPage = openManagementPage();

    const code = generateRandomId();
    const name = 'missing required field';

    // go to add page
    currentPage = currentPage.getContent().clickAddButton();

    const pageContent = currentPage.getContent();

    // fill mandatory data
    pageContent
        .fillRequiredData(name, name, code, 0, OOTB_PAGE_TEMPLATES[0]);

    // save buttons should be enabled
    pageContent.getSaveButton().should('not.be.disabled');
    pageContent.getSaveAndDesignButton().should('not.be.disabled');

    pageContent.getCode().clear();

    // save buttons should be disabled after cleaning required data
    pageContent.getSaveButton().should('be.disabled');
    pageContent.getSaveAndDesignButton().should('be.disabled');
  });

  it('create a child page', () => {
    currentPage = openManagementPage();

    const code = generateRandomId();
    const name = 'child page';

    // add a child page for sitemap
    currentPage = currentPage.getContent().getKebabMenu('sitemap').open().openAdd();

    currentPage.getContent()
        .fillRequiredData(name, name, code, undefined, OOTB_PAGE_TEMPLATES[0]);

    currentPage = currentPage.getContent().clickSaveButton();

    cy.wait(1000);

    currentPage.getContent().clickExpandAll();
    cy.wait(2000);

    // page should be created successfully
    currentPage.getContent().getTableRows().should('contain', name);

    // delete recently added page
    cy.pagesController().then(controller => controller.deletePage(code));
    cy.wait(1000);
  });

});

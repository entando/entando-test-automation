import HomePage from "../../support/pageObjects/HomePage";
import { generateRandomId } from '../../support/utils';

let currentPage;

const openManagementPage = () => {
    cy.visit('/');
    let currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
}

const OOTB_PAGE_TEMPLATES = ['1-2-column', '1-2x2-1-column', '1-2x4-1-column', '1-column', 'content-page', 'home', 'single_frame_page']
const OOTB_OWNER_GROUPS = ['Administrators', 'Free Access'];
const OOTB_CODE = 'sitemap';

describe('Pages Management - Update', () => {
    beforeEach(() => {
        cy.kcLogin("admin").as("tokens");
    });

    afterEach(() => {
        cy.kcLogout();
    });

  it('reuse existing code page', () => {
    currentPage = openManagementPage();

    // go to add page
    currentPage = currentPage.getContent().openAddPagePage();

    currentPage.getContent()
        .fillRequiredData(`Existing code`, `Existing code`, OOTB_CODE, 0, OOTB_PAGE_TEMPLATES[0]);

    currentPage.getContent().clickSaveButton();

    cy.wait(2000);
    // should not be able to save page with existing page code
    currentPage.getContent().getAlertMessage().contains(OOTB_CODE).should('be.visible');
  });

  it('use non existing page template', () => {
    currentPage = openManagementPage();

    // go to add page
    currentPage = currentPage.getContent().openAddPagePage();

    currentPage.getContent().getPageTemplateSelect().children('option').then(options => {
      [...options].forEach(o => {

        if (o.value) {
          // should contain all OOTB values
          expect(OOTB_PAGE_TEMPLATES).to.include(o.value);
        }
      });
    });
  });

  it('use non existing owner groups', () => {
    currentPage = openManagementPage();

    // go to add page
    currentPage = currentPage.getContent().openAddPagePage();

    currentPage.getContent().openOwnerGroupMenu();
    cy.wait(1000);

    currentPage.getContent().getOwnerGroupDropdown().children('li').then(listItems => {
      [...listItems].forEach(li => {
        expect(OOTB_OWNER_GROUPS.includes(li.innerText)).to.eq(true);
      });
    })
  });

  it('use non existing parent code', () => {
    currentPage = openManagementPage();

    cy.visit('/page/add?parentCode=non-existing-page');
    cy.wait(3000);

    // should redirect back to /page/add when parentCode does not exist
    cy.location().should(loc => {
      expect(loc.pathname).to.eq('/page/add');
      expect(loc.search).to.eq('');
    })
  });

  // should be enable after PR #1109 gets merged
  xit('with an owner not compatible with the users', () => {
    currentPage = openManagementPage();

    // edit sitemap page
    currentPage = currentPage.getContent().getKebabMenu('sitemap').open().openEdit();

    currentPage.getContent().getOwnerGroupButton().should('be.disabled');
  });

  it('publish a page that links to unpublished contents or pages', () => {
    currentPage = openManagementPage();
    const code = generateRandomId();
    const name = 'unpublished page';

    // go to add page
    currentPage = currentPage.getContent().openAddPagePage();

    currentPage.getContent()
            .fillRequiredData(name, name, code, 0, '1-2-column');

    currentPage = currentPage.getContent().clickSaveButton();

    cy.wait(1000);

    // add a child page to an unpublished page
    const childCode = generateRandomId();
    const childName = 'child page';

    currentPage = currentPage.getContent().getKebabMenu(code).open().openAdd();
    currentPage.getContent()
    .fillRequiredData(childName, childName, childCode, undefined, '1-2-column');

    currentPage = currentPage.getContent().clickSaveButton();
    cy.wait(1000);

    // expand tree
    currentPage.getContent().getTableRows().contains(name).click();
    cy.wait(2000);

    // should not be able to publish a child page of an unpublished page
    currentPage.getContent().getKebabMenu(childCode).getPublish().should('have.class', 'disabled');

    // delete recently added page
    cy.pagesController().then(controller => {
      controller.deletePage(childCode);
      controller.deletePage(code);
    });
  });
});

import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Groups', () => {

  beforeEach(() => {
    cy.wrap(null).as('groupToBeDeleted');
    cy.wrap(null).as('pageToBeDeleted')
    cy.wrap(generateRandomId())
      .then(groupName => {
        cy.wrap(groupName).as('groupName');
        cy.wrap(groupName.toLowerCase()).as('groupCode');
      });

    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@groupToBeDeleted').then(groupCode => {
      if(groupCode) cy.groupsController().then(controller => controller.deleteGroup(groupCode));
    })
    cy.kcUILogout();
  });

  it([Tag.GTS, 'ENG-2530'], 'Add a new group', function () {
    openGroupsPage()
      .then(page => page.getContent().openAddGroupPage())
      .then(page => page.getContent().addGroup(this.groupName, this.groupCode))
      .then(page => {
        cy.wrap(this.groupCode).as('groupToBeDeleted');
        page.getContent().getTableRow(this.groupCode).children(htmlElements.td)
            .then(cells => cy.validateListTexts(cells, [this.groupName, this.groupCode]));
      });
  });

  it([Tag.GTS, 'ENG-2530'], 'Add a new group using an existing code - not allowed', function () {
    addGroup(this.groupCode, this.groupName);

    openGroupsPage()
      .then(page => page.getContent().openAddGroupPage())
      .then(page => {
        page.getContent().getCodeInput().then(input => page.getContent().type(input, this.groupCode));
        page.getContent().getNameInput().then(input => page.getContent().type(input, this.groupName));
        page.getContent(). getSaveButton().then(button => page.getContent().click(button));
        cy.validateToast(page, this.groupCode, false);
      });
  });

  it([Tag.GTS, 'ENG-2530'], 'Update an existing group', function () {
    addGroup(this.groupCode, this.groupName);

    cy.wrap(generateRandomId()).then(updatedGroupName => {
      openEdit(this.groupCode, this.groupName)
        .then(page => page.getContent().editGroup(updatedGroupName))
        .then(page => {
          page.getContent().getTableRow(this.groupCode).children(htmlElements.td)
                           .then(cells => cy.validateListTexts(cells, [updatedGroupName, this.groupCode]))
          page.getContent().getKebabMenu(this.groupCode).open().openDetails();
        })
        .then(page => page.getContent().getDetailsInfo()
                          .within(info => {
                            cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should('have.text', this.groupCode);
                            cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should('have.text', updatedGroupName);
                          }));
    });
  });

  it([Tag.GTS, 'ENG-2530'], 'Delete an existing group', function () {
    addGroup(this.groupCode, this.groupName);

    openGroupsPage()
      .then(page => {
        page.getContent().getKebabMenu(this.groupCode).open().clickDelete();
        page.getDialog().getBody().getStateInfo().should('contain', this.groupCode);
        page.getDialog().confirm();
        page.getContent().getTableRows().should('not.contain', this.groupCode);
        cy.wrap(null).as('groupToBeDeleted');
      });
  });

  describe('Groups - referenced by a page', () => {
    const page = {
      charset: 'utf-8',
      code: 'test',
      contentType: 'text/html',
      pageModel: '1-2-column',
      parentCode: 'homepage',
      titles: {en: 'Test'}
    };

    beforeEach(function () {
      addGroup(this.groupCode, this.groupName);
      cy.seoPagesController().then(controller => {
        controller.addNewPage({...page, ownerGroup: this.groupCode});
        cy.wrap(page.code).as('pageToBeDeleted');
      });
    });

    afterEach(() => {
      cy.get('@pageToBeDeleted').then(pageCode => {
        if (pageCode) {
          cy.pagesController().then(controller => controller.setPageStatus(pageCode, 'draft'));
          cy.pagesController().then(controller => controller.deletePage(pageCode));
        }
      });
    });

    it([Tag.GTS, 'ENG-2531'], 'Update a group used by an unpublished page', function () {
      cy.wrap(generateRandomId()).then(updatedGroupName => {
        openEdit(this.groupCode, this.groupName)
          .then(page => page.getContent().editGroup(updatedGroupName))
          .then(page => {
            page.getContent().getTableRow(this.groupCode).children(htmlElements.td)
                             .then(cells => cy.validateListTexts(cells, [updatedGroupName, this.groupCode]));
            page.getContent().getKebabMenu(this.groupCode).open().openDetails();
          })
          .then(page => page.getContent().getDetailsInfo()
                            .within(info => {
                              cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should('have.text', this.groupCode);
                              cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should('have.text', updatedGroupName);
                            }));
      });
    });

    it([Tag.GTS, 'ENG-2531'], 'Update a group used by a published page', function () {
      cy.pagesController().then(controller => controller.setPageStatus(this.pageToBeDeleted, 'published'));

      cy.wrap(generateRandomId()).then(updatedGroupName => {
        openEdit(this.groupCode, this.groupName)
          .then(page => page.getContent().editGroup(updatedGroupName))
          .then(page => {
            page.getContent().getTableRow(this.groupCode).children(htmlElements.td)
                             .then(cells => cy.validateListTexts(cells, [updatedGroupName, this.groupCode]));
            page.getContent().getKebabMenu(this.groupCode).open().openDetails();
          })
          .then(page => page.getContent().getDetailsInfo()
                            .within(info => {
                              cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should('have.text', this.groupCode);
                              cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should('have.text', updatedGroupName);
                            }));
      });
    });

    it([Tag.GTS, 'ENG-2532'], 'Delete a group used by an unpublished page - not allowed', function () {
      openGroupsPage()
        .then(page => {
          page.getContent().getKebabMenu(this.groupCode).open().clickDelete();
          page.getDialog().getBody().getStateInfo().should('contain', this.groupCode);
          page.getDialog().confirm();
          cy.validateToast(page, this.groupCode, false);
        });
    });

    it([Tag.GTS, 'ENG-2532'], 'Delete a group used by a published page - not allowed', function () {
      cy.pagesController().then(controller => controller.setPageStatus(this.pageToBeDeleted, 'published'));

      openGroupsPage()
        .then(page => {
          page.getContent().getKebabMenu(this.groupCode).open().clickDelete();
          page.getDialog().getBody().getStateInfo().should('contain', this.groupCode);
          page.getDialog().confirm();
          cy.validateToast(page, this.groupCode, false);
        });
    });
  });

  const openGroupsPage = () => cy.get('@currentPage').then(page => page.getMenu().getUsers().open().openGroups());

  const addGroup = (code, name) => {
    cy.groupsController().then(controller => {
      controller.addGroup(code, name);
      cy.wrap(code).as('groupToBeDeleted');
    });
  };

  const openEdit = (code, name) => {
    return openGroupsPage()
      .then(page => page.getContent().getKebabMenu(code).open().openEdit())
      .then(page => {
        page.getContent().getNameInput().should('have.value', name);
        cy.wrap(page).as('currentPage');
      });
  };

});

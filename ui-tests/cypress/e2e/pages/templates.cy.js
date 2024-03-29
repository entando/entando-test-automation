import {htmlElements}     from "../../support/pageObjects/WebElement";
import {generateRandomId} from "../../support/utils";
import defaultTemplates   from "../../fixtures/data/defaultTemplates.json";
import sampleData         from "../../fixtures/data/sampleData.json";

describe('Page Templates', () => {

  beforeEach(() => {
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
    cy.wrap([]).as('templatesToBeDeleted');
    sampleData.code  = generateRandomId();
    sampleData.descr = generateRandomId();
    cy.wrap(generateRandomId()).as('editedDataCode');
    cy.wrap(generateRandomId()).as('editedDataDescr');
  });

  afterEach(() => {
    cy.get('@templatesToBeDeleted').then(templatesToBeDeleted => {
      if (templatesToBeDeleted) cy.pageTemplatesController()
                                  .then(controller => {
                                    templatesToBeDeleted.forEach(templateToBeDeleted => controller.deletePageTemplate(templateToBeDeleted))
                                  });
    });
    cy.kcTokenLogout();
  });

  const openPageTemplateMgmtPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getPages().open().openTemplates());
  };

  const addPageTemplate = (data) => {
    cy.pageTemplatesController()
        .then(controller => controller.addPageTemplate({
          ...data,
          configuration: JSON.parse(data.configuration)
        }));
    cy.pushAlias('@templatesToBeDeleted', data.code);
  };

  const addRandomPageTemplates = (number) => {
    for (let index = 0; index < number; index++) {
      const randomData = {code: generateRandomId(), descr: generateRandomId(), configuration: sampleData.configuration, template: sampleData.template};
      addPageTemplate(randomData);
    }
  };

  describe('Templates section structure', () => {

    it([Tag.SMOKE, 'ENG-3525'], 'Templates section', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTable().should('exist').and('be.visible')
              .then(table => {
                cy.wrap(table.children(htmlElements.thead).find(htmlElements.th))
                  .then(headings => cy.validateListTexts(headings, ['Code', 'Name', 'Actions']));
              });
          page.getContent().getAddButton().should('exist').and('be.visible');
          page.getContent().getPagination().get().should('exist').and('be.visible');
          page.getContent().getPagination().getInput().should('have.value', 1);
        });
    });

    it([Tag.SMOKE, 'ENG-3525', 'ENG-3918'], 'Add template page', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().getFormArea().should('exist').and('be.visible')
              .then(form => cy.wrap(form).find(htmlElements.label)
              .then(labels => cy.validateListTexts(labels, ['Code ', 'Name ', 'JSON configuration ', 'Template ', 'Template preview'])));
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getNameInput().should('exist').and('be.visible');
          page.getContent().getJsonConfigInput().should('exist').and('be.visible');
          page.getContent().getTemplateInput().should('exist').and('be.visible');
          page.getContent().getPreviewGrid().should('exist').and('be.visible');
          page.getContent().getCancelButton().should('exist').and('be.visible');
          page.getContent().getSaveDropdownButton().should('exist').and('be.visible');
        });
    });

    it([Tag.SMOKE, 'ENG-3525'], 'Templates context menu', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => {
          const kebabMenu = page.getContent().getKebabMenuByCode(sampleData.code).open();
          kebabMenu.getMenu().should('exist').and('be.visible');
          kebabMenu.getMenuList().then(elements => cy.validateListTexts(elements, ['Edit', 'Clone', 'Details', 'Delete']));
        });
    });

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3525', 'ENG-3918'], 'Edit template page', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openEdit())
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getNameInput().should('exist').and('be.visible');
          page.getContent().getJsonConfigInput().should('exist').and('be.visible');
          page.getContent().getTemplateInput().should('exist').and('be.visible');
          page.getContent().getPreviewGrid().should('exist').and('be.visible');
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
            page.getContent().getCancelButton().should('exist').and('be.visible');
            page.getContent().getSaveDropdownButton().should('exist').and('be.visible');
          }
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
            page.getContent().getCodeInput().should('have.value', sampleData.code);
            page.getContent().getNameInput().should('have.value', sampleData.descr);
            page.getContent().getJsonConfigValue().should(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(sampleData.configuration.replaceAll(' ', '')));
            page.getContent().getTemplateValue().should(value => expect(value).to.equal(sampleData.template));
          }
        });
    });

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3525', 'ENG-3918'], 'Clone template page', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openClone())
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible');
          page.getContent().getNameInput().should('exist').and('be.visible');
          page.getContent().getJsonConfigInput().should('exist').and('be.visible');
          page.getContent().getTemplateInput().should('exist').and('be.visible');
          page.getContent().getPreviewGrid().should('exist').and('be.visible');
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('SMOKE')) {
            page.getContent().getCancelButton().should('exist').and('be.visible');
            page.getContent().getSaveDropdownButton().should('exist').and('be.visible');
          }
          if (!Cypress.env('INCLUDE_TAGS') || Cypress.env('INCLUDE_TAGS').split(',').includes('FEATURE')) {
            page.getContent().getJsonConfigValue().should(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(sampleData.configuration.replaceAll(' ', '')));
            page.getContent().getTemplateValue().should(value => expect(value).to.equal(sampleData.template));
          }
        });
    });

    it([Tag.SMOKE, 'ENG-3525', 'ENG-3918'], 'Template details page', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openDetails())
        .then(page => {
          page.getContent().getTemplateDetailsTable().should('exist').and('be.visible')
              .then(table => cy.wrap(table).find(htmlElements.th)
                                           .then(headers => cy.validateListTexts(headers, ['Name', 'Code', 'Plugin code', 'JSON configuration', 'Template', 'Template preview'])));
          page.getContent().getPluginCode().should('exist').and('be.visible');
          page.getContent().getReferencedPagesDiv().should('exist').and('be.visible');
          page.getContent().getEditButton().should('exist').and('be.visible');
        });
    });

    it([Tag.FEATURE, 'ENG-3525', 'ENG-3663', 'ENG-3918'], 'Navigating to edit template page from details', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openDetails())
        .then(page => page.getContent().openEditTemplate(sampleData.code))
        .then(page => {
          page.getContent().getCodeInput().should('exist').and('be.visible').and('have.value', sampleData.code);
          page.getContent().getNameInput().should('exist').and('be.visible').and('have.value', sampleData.descr);
          page.getContent().getCancelButton().should('exist').and('be.visible');
          page.getContent().getSaveDropdownButton().should('exist').and('be.visible');
          page.getContent().getJsonConfigInput().should('exist').and('be.visible');
          page.getContent().getJsonConfigValue().then(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(sampleData.configuration.replaceAll(' ', '')));
          page.getContent().getTemplateInput().should('exist').and('be.visible');
          page.getContent().getTemplateValue().then(value => expect(value).to.equal(sampleData.template));
          page.getContent().getPreviewGrid().should('exist').and('be.visible');
        });
    });

  });

  describe('Templates list', () => {

    it([Tag.SANITY, 'ENG-3525'], 'Default page templates', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTable().should('exist').and('be.visible')
              .then(table => {
                cy.wrap(table.children(htmlElements.tbody).find(htmlElements.tr))
                  .then(rows => cy.validateListTexts(rows, defaultTemplates.map(template => template.code + template.descr + 'EditCloneDetailsDelete')));
              });
        });
    });

    it([Tag.SANITY, 'ENG-3525'], 'The templates list pagination should be correct', () => {
      addRandomPageTemplates(4);

      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTable().should('exist').and('be.visible')
              .then(table => {
                cy.wrap(table.children(htmlElements.tbody).find(htmlElements.tr))
                  .then(rows => {
                    page.getContent().getPagination().getPageSizeDropdown().should('have.text', rows.length+' ');
                  });
              });
          page.getContent().getPagination().getInput().should('have.value', 1);
        });
    });

    describe('Navigating the pagination', () => {

      before(() => {
        cy.kcClientCredentialsLogin();
        cy.wrap([]).as('templatesToBeDeleted');
        addRandomPageTemplates(14);
        cy.get('@templatesToBeDeleted').then(templates => Cypress.env('commonTemplatesToBeDeleted', templates));
      });

      after(() => {
        cy.kcClientCredentialsLogin();

        cy.wrap(Cypress.env('commonTemplatesToBeDeleted')).then(templatesToBeDeleted => {
          if (templatesToBeDeleted) cy.pageTemplatesController()
                                      .then(controller => {
                                        templatesToBeDeleted.forEach(templateToBeDeleted => controller.deletePageTemplate(templateToBeDeleted));
                                      });
        });
      });

      it([Tag.SANITY, 'ENG-3525'], 'Next page button', () => {
        openPageTemplateMgmtPage()
          .then(page => page.getContent().getPagination().navigateToNextPage())
          .then(page => {
            page.getContent().getPagination().getInput().should('have.value', 2);
            page.getContent().getPagination().getItemsCurrent().should('have.text', '11-20');
          });
      });

      it([Tag.SANITY, 'ENG-3525'], 'Page field navigation', () => {
        openPageTemplateMgmtPage()
          .then(page => page.getContent().getPagination().navigateToPage(3))
          .then(page => {
            page.getContent().getPagination().getInput().should('have.value', 3);
            page.getContent().getPagination().getItemsCurrent().should('have.text', '21-21');
          });
      });

      it([Tag.SANITY, 'ENG-3525'], 'Previous page button', () => {
        openPageTemplateMgmtPage()
          .then(page => page.getContent().getPagination().navigateToPage(3))
          .then(page => page.getContent().getPagination().navigateToPreviousPage())
          .then(page => {
            page.getContent().getPagination().getInput().should('have.value', 2);
            page.getContent().getPagination().getItemsCurrent().should('have.text', '11-20');
          });
      });

      it([Tag.SANITY, 'ENG-3525'], 'First page button', () => {
        openPageTemplateMgmtPage()
          .then(page => page.getContent().getPagination().navigateToPage(3))
          .then(page => page.getContent().getPagination().navigateToFirstPage())
          .then(page => {
            page.getContent().getPagination().getInput().should('have.value', 1);
            page.getContent().getPagination().getItemsCurrent().should('have.text', '1-10');
          });
      });

      it([Tag.SANITY, 'ENG-3525'], 'Last page button', () => {
        openPageTemplateMgmtPage()
          .then(page => page.getContent().getPagination().navigateToLastPage())
          .then(page => {
            page.getContent().getPagination().getInput().should('have.value', 3);
            page.getContent().getPagination().getItemsCurrent().should('have.text', '21-21');
          });
      });

    });

  });

  describe('Adding and editing templates', () => {

    it([Tag.SANITY, 'ENG-3525'], 'Creating a new template', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTableRows().then(rows => cy.wrap(rows.length).as('previousRows'));
          page.getContent().openAddPage();
        })
        .then(page => {
          page.getContent().fillForm(sampleData);
          page.getContent().submitForm();
        })
        .then(page => {
          cy.wrap([sampleData.code]).as('templatesToBeDeleted');
          cy.validateToast(page, sampleData.code);
          page.getContent().getTable().should('exist').and('be.visible');
          cy.get('@previousRows').then(previousRows => page.getContent().getTableRows().should('have.length', previousRows+1));
          page.getContent().getTableRow(sampleData.code).should('exist').children(htmlElements.td).eq(2).should('have.text', sampleData.descr);
          page.getContent().getPagination().getItemsTotal().should('have.text', defaultTemplates.length+1);
        });
    });

    it([Tag.FEATURE, 'ENG-3525'], 'When selecting save and continue, the edit form is displayed and a successful toast notification is displayed', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().fillForm(sampleData);
          page.getContent().submitFormAndContinue(sampleData.code);
        })
        .then(page => {
          cy.wrap([sampleData.code]).as('templatesToBeDeleted');
          cy.validateToast(page, sampleData.code);
          page.getContent().getCodeInput().should('be.disabled').and('have.value', sampleData.code);
          page.getContent().getNameInput().should('have.value', sampleData.descr);
          page.getContent().getJsonConfigValue().then(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(sampleData.configuration.replaceAll(' ', '')));
          page.getContent().getTemplateValue().then(value => expect(value).to.equal(sampleData.template));
        });
    });

    it([Tag.ERROR, 'ENG-3525'], 'When deselecting the code field without filling it, an error is displayed for the field', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().getCodeInput().parent().siblings(`${htmlElements.span}.help-block`).should('not.exist');
          page.getContent().getCodeInput().focus().blur();
          page.getContent().getCodeInput().parent().siblings(`${htmlElements.span}.help-block`).should('exist').and('be.visible');
        });
    });

    it([Tag.ERROR, 'ENG-3525'], 'When deselecting the name and JSON configuration fields without filling them, an error is displayed for the deselected field', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().getJsonConfigInput().parent().siblings(`${htmlElements.div}.help-block`).should('not.exist');
          page.getContent().getNameInput().parent().siblings(`${htmlElements.span}.help-block`).should('not.exist');
          page.getContent().clearJsonConfig();
          page.getContent().getNameInput().focus().blur();
          page.getContent().getJsonConfigInput().parent().siblings(`${htmlElements.div}.help-block`).should('exist').and('be.visible');
          page.getContent().getNameInput().parent().siblings(`${htmlElements.span}.help-block`).should('exist').and('be.visible');
        });
    });

    it([Tag.ERROR, 'ENG-3525'], 'When trying to create a new template with an already existing code, an error toast notification is displayed', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().fillForm(sampleData);
          page.getContent().submitForm(true);
        })
        .then(page => cy.validateToast(page, sampleData.code, false));
    });

    it([Tag.ERROR, 'ENG-3525'], 'When creating a template not setting any frame in the JSON configuration, an error toast notification is displayed', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().fillForm({
            code: sampleData.code,
            descr: sampleData.descr,
            configuration: '{"frames": []}',
            template: sampleData.template
          });
          page.getContent().submitForm(true);
        })
        .then(page => cy.validateToast(page, 'frame', false));
    });

    it([Tag.ERROR, 'ENG-3525'], 'When creating a template and a frame has the wrong index, an error is displayed for the field', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().fillForm({code: sampleData.code, descr: sampleData.descr, configuration: '{"frames": [{"pos": 1, "descr": "Logo", "mainFrame": false, "defaultWidget": {"code": "logo","properties": null}, "sketch": {"x1": 0, "y1": 0, "x2": 2, "y2": 0}}]}', template: sampleData.template});
          page.getContent().getJsonConfigInput().parent().siblings(`${htmlElements.div}.help-block`).should('exist').and('be.visible').and('contain', 'index');
        });
    });

    it([Tag.ERROR, 'ENG-3525'], 'When creating a template and a frame does not have a description, an error toast notification is displayed', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().fillForm({
            code: sampleData.code,
            descr: sampleData.descr,
            configuration: '{"frames": [{"pos": 0, "mainFrame": false, "defaultWidget": {"code": "logo","properties": null}, "sketch": {"x1": 0, "y1": 0, "x2": 2, "y2": 0}}]}',
            template: sampleData.template
          });
          page.getContent().submitForm(true);
        })
        .then(page => cy.validateToast(page, 'description', false));
    });

    it([Tag.ERROR, 'ENG-3525'], 'When creating a template and a frame does not have coordinates, an error toast notification is displayed', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          page.getContent().fillForm({
            code: sampleData.code,
            descr: sampleData.descr,
            configuration: '{"frames": [{"pos": 0, "descr": "Logo", "mainFrame": false, "defaultWidget": {"code": "logo","properties": null}}]}',
            template: sampleData.template
          });
          page.getContent().submitForm(true);
        })
        .then(page => cy.validateToast(page, 'sketch', false));
    });

    it([Tag.SANITY, 'ENG-3525'], 'Editing a template', function () {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openEdit())
        .then(page => {
          page.getContent().getNameInput().should('have.value', sampleData.descr);
          page.getContent().typeName(this.editedDataDescr);
          page.getContent().submitForm();
        })
        .then(page => {
          cy.validateToast(page, sampleData.code);
          page.getContent().getTable().should('exist').and('be.visible');
          page.getContent().getTableRow(sampleData.code).children(htmlElements.td).eq(2).should('have.text', this.editedDataDescr)
                                                                                        .and('not.have.text', sampleData.descr);
        });
    });

    it([Tag.FEATURE, 'ENG-3525'], 'When selecting save and continue in the edit template page, a successful toast notification is displayed', function () {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openEdit())
        .then(page => {
          page.getContent().getNameInput().should('have.value', sampleData.descr);
          page.getContent().typeName(this.editedDataDescr);
          page.getContent().submitEditFormAndContinue(sampleData.code);
        })
        .then(page => {
          cy.validateToast(page, sampleData.code);
          page.getContent().getNameInput().should('have.value', this.editedDataDescr);
        });
    });

    it([Tag.SANITY, 'ENG-3525'], 'Cloning a template', function () {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTableRows().then(rows => cy.wrap(rows.length).as('previousRows'));
          page.getContent().getKebabMenuByCode(sampleData.code).open().openClone();
        })
        .then(page => {
          page.getContent().typeCode(this.editedDataCode);
          page.getContent().typeName(this.editedDataDescr);
          page.getContent().submitForm();
        })
        .then(page => {
          cy.pushAlias('@templatesToBeDeleted', this.editedDataCode);
          cy.validateToast(page, this.editedDataCode);
          page.getContent().getTable().should('exist').and('be.visible');
          cy.get('@previousRows').then(previousRows => page.getContent().getTableRows().should('have.length', previousRows+1));
          page.getContent().getPagination().getItemsTotal().should('have.text', defaultTemplates.length+2);
          page.getContent().getTableRow(sampleData.code).should('exist').children(htmlElements.td).eq(2).should('have.text', sampleData.descr);
          page.getContent().getTableRow(this.editedDataCode).should('exist').children(htmlElements.td).eq(2).should('have.text', this.editedDataDescr);
        });
    });

    it([Tag.FEATURE, 'ENG-3525'], 'When selecting save and continue in the clone template page, a successful toast notification is displayed', function () {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openClone())
        .then(page => {
          page.getContent().typeCode(this.editedDataCode);
          page.getContent().typeName(this.editedDataDescr);
          page.getContent().submitFormAndContinue(this.editedDataCode);
        })
        .then(page => {
          cy.pushAlias('@templatesToBeDeleted', this.editedDataCode);
          cy.validateToast(page, this.editedDataCode);
          page.getContent().getNameInput().should('have.value', this.editedDataDescr);
          page.getContent().getCodeInput().should('be.disabled').and('have.value', this.editedDataCode);
        });
    });

  });

  describe('Deletion of a template', () => {

    it([Tag.SANITY, 'ENG-3525'], 'When trying to delete a template, a confirmation modal should be displayed', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getKebabMenuByCode(sampleData.code).open().clickDelete();
          page.getDialog().get().should('exist');
          page.getDialog().getBody().getStateInfo().should('be.visible').and('contain', sampleData.code);
        });
    });

    it([Tag.SANITY, 'ENG-3525', 'ENG-3664'], 'When confirming deletion, the list should be updated and a successful toast notification displayed', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTableRows().then(rows => cy.wrap(rows.length).as('previousRows'));
          page.getContent().getKebabMenuByCode(sampleData.code).open().clickDelete();
          page.getDialog().confirm();
          page.getDialog().get().should('not.exist');
          cy.validateToast(page);
          page.getContent().getTable().should('exist').and('be.visible');
          cy.get('@previousRows').then(previousRows => page.getContent().getTableRows().should('have.length', previousRows-1));
          page.getContent().getTableRows().find(`button#${sampleData.code}-actions`).should('not.exist');
          cy.wrap(null).as('templatesToBeDeleted');
          page.getContent().getPagination().getItemsTotal().should('have.text', defaultTemplates.length);
        });
    });

    it([Tag.SANITY, 'ENG-3525'], 'When canceling deletion, the template should not be deleted', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTableRows().then(rows => cy.wrap(rows.length).as('previousRows'));
          page.getContent().getKebabMenuByCode(sampleData.code).open().clickDelete();
          page.getDialog().cancel();
          page.getDialog().get().should('not.exist');
          page.getContent().getTable().should('exist').and('be.visible');
          cy.get('@previousRows').then(previousRows => page.getContent().getTableRows().should('have.length', previousRows));
          page.getContent().getTableRow(sampleData.code).should('exist').and('be.visible');
          page.getContent().getPagination().getItemsTotal().should('have.text', defaultTemplates.length+1);
        });
    });

  });

  describe('Breadcrumb navigation', () => {

    it([Tag.FEATURE, 'ENG-3525'], 'When navigating out of add template page, no template is added', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          page.getContent().getTableRows().then(rows => cy.wrap(rows.length).as('previousRows'));
          page.getContent().openAddPage();
        })
        .then(page => {
          page.getContent().fillForm(sampleData);
          page.getContent().openTemplatesUsingBreadCrumb();
        })
        .then(page => {
          page.getContent().getTable().should('exist').and('be.visible')
          cy.get('@previousRows').then(previousRows => page.getContent().getTableRows().should('have.length', previousRows));
          page.getContent().getTableRows().find(`button#${sampleData.code}-actions`).should('not.exist');
          page.getContent().getPagination().getItemsTotal().should('have.text', defaultTemplates.length);
        });
    });

    it([Tag.FEATURE, 'ENG-3525'], 'When navigating out of edit template page, the template is not changed', function () {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openEdit())
        .then(page => {
          page.getContent().getNameInput().should('have.value', sampleData.descr);
          page.getContent().typeName(this.editedDataDescr);
          page.getContent().getNameInput().should('have.value', this.editedDataDescr);
          page.getContent().openTemplatesUsingBreadCrumb();
        })
        .then(page => {
          page.getContent().getTable().should('exist').and('be.visible');
          page.getContent().getTableRow(sampleData.code).should('exist').children(htmlElements.td).eq(2).should('have.text', sampleData.descr)
                                                                                                        .and('not.have.text', this.editedDataDescr);
        });
    });

    it([Tag.FEATURE, 'ENG-3525'], 'When navigating out of details page, the template is not changed', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openDetails())
        .then(page => page.getContent().openTemplatesUsingBreadCrumb())
        .then(page => {
          page.getContent().getTable().should('exist').and('be.visible');
          page.getContent().getTableRow(sampleData.code).should('exist').children(htmlElements.td).eq(2).should('have.text', sampleData.descr);
        });
    });

  });

});

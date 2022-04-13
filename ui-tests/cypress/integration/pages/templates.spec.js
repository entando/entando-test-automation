import {htmlElements}     from "../../support/pageObjects/WebElement";
import {generateRandomId} from "../../support/utils";
import defaultTemplates   from "../../fixtures/data/defaultTemplates.json";
import sampleData         from "../../fixtures/data/sampleData.json";

describe('Page Templates', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.wrap([]).as('templatesToBeDeleted');
    sampleData.code  = generateRandomId();
    sampleData.descr = generateRandomId();
  });

  afterEach(() => {
    cy.get('@templatesToBeDeleted').then(templatesToBeDeleted => {
      if (templatesToBeDeleted) cy.pageTemplatesController()
                                  .then(controller => {
                                    templatesToBeDeleted.forEach(templateToBeDeleted => controller.deletePageTemplate(templateToBeDeleted))
                                  });
    });
    cy.kcUILogout();
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

  describe('Templates section structure', () => {

    it([Tag.SMOKE, 'ENG-3525'], 'Templates section', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          cy.validateUrlPathname('/page-template');
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

    it([Tag.SMOKE, 'ENG-3525'], 'Add template page', () => {
      openPageTemplateMgmtPage()
        .then(page => page.getContent().openAddPage())
        .then(page => {
          cy.validateUrlPathname('/page-template/add');
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

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3525'], 'Edit template page', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openEdit())
        .then(page => {
          cy.validateUrlPathname(`/page-template/edit/${sampleData.code}`);
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

    it([Tag.SMOKE, Tag.FEATURE, 'ENG-3525'], 'Clone template page', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openClone())
        .then(page => {
          cy.validateUrlPathname(`/page-template/clone/${sampleData.code}`);
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

    it([Tag.SMOKE, 'ENG-3525'], 'Template details page', () => {
      addPageTemplate(sampleData);

      openPageTemplateMgmtPage()
        .then(page => page.getContent().getKebabMenuByCode(sampleData.code).open().openDetails())
        .then(page => {
          cy.validateUrlPathname(`/page-template/view/${sampleData.code}`);
          page.getContent().getTemplateDetailsTable().should('exist').and('be.visible')
              .then(table => cy.wrap(table).find(htmlElements.th)
                                           .then(headers => cy.validateListTexts(headers, ['Name', 'Code', 'Plugin code', 'JSON configuration', 'Template', 'Template preview'])));
          page.getContent().getPluginCode().should('exist').and('be.visible');
          page.getContent().getReferencedPagesDiv().should('exist').and('be.visible');
          page.getContent().getEditButton().should('exist').and('be.visible');
        });
    });

  });

  describe('Templates list', () => {

    it([Tag.SANITY, 'ENG-3525'], 'Default page templates', () => {
      openPageTemplateMgmtPage()
        .then(page => {
          cy.validateUrlPathname('/page-template');
          page.getContent().getTable().should('exist').and('be.visible')
              .then(table => {
                cy.wrap(table.children(htmlElements.tbody).find(htmlElements.tr))
                  .then(rows => cy.validateListTexts(rows, defaultTemplates.map(template => template.code + template.descr + 'EditCloneDetailsDelete')));
              });
        });
    });

  });

});

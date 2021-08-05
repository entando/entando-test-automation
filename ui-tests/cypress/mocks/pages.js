export const PAGE_WITHOUT_SEO_DATA = {
  code: 'page_no_seo',
  displayedInMenu: true,
  pageModel: '1-2-column',
  charset: 'utf-8',
  contentType: 'text/html',
  parentPage: 'My Homepage',
  seo: true,
  titles: {
    en: 'Test Page',
    it: 'Pagina di test',
  },
  ownerGroup: 'Administrators',
  joinGroups: ['free'],
};

export const PAGE_FREE_OWNER_GROUP = {
  code: 'page_free',
  displayedInMenu: true,
  pageModel: '1-2-column',
  charset: 'utf-8',
  contentType: 'text/html',
  parentPage: 'Home',
  seo: true,
  titles: {
    en: 'Page Free Owner',
    it: 'Pagina Free Owner',
  },
  ownerGroup: 'Free Access',
  joinGroups: ['free'],
};

export const DATA_TESTID = 'data-testid';
export const DATA_ID     = 'data-id';

export const htmlElements = {
  body: 'body',
  nav: 'nav',
  div: 'div',
  h1: 'h1',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  span: 'span',
  i: 'i',
  ol: 'ol',
  ul: 'ul',
  li: 'li',
  dl: 'dl',
  dt: 'dt',
  dd: 'dd',
  a: 'a',
  table: 'table',
  thead: 'thead',
  tbody: 'tbody',
  tr: 'tr',
  th: 'th',
  td: 'td',
  form: 'form',
  input: 'input',
  button: 'button',
  select: 'select',
  option: 'option',
  label: 'label',
  fieldset: 'fieldset',
  legend: 'legend',
  textarea: 'textarea',
  img: 'img',
  iframe: 'iframe'
};

export class WebElement {

  constructor(parent = new HTML()) {
    this.parent = parent;
  }

  get() {
    // each class must have it's own identifier described in the get method starting from this.parent.get()
    throw new Error('Implement a specific get for the sub-class!');
  }

}

class HTML extends WebElement {

  constructor() {
    super(null);
  }

  get() {
    return cy.root();
  }

}

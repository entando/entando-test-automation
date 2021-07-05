export const TEST_ID_KEY = "data-testid"

export const htmlElements = {
  body: "body",
  nav: "nav",
  div: "div",
  h1: "h1",
  ol: "ol",
  ul: "ul",
  li: "li",
  a: "a",
  table: "table",
  tbody: "tbody",
  tr: "tr",
  form: "form",
  input: "input",
  button: "button"
}

export class WebElement {

  constructor(parent = new HTML()) {
    this.parent = parent
  }

  get() {
    // each class must have it's own identifier described in the get method starting from this.parent.get()
    throw new Error("Implement a specific get for the sub-class!");
  }

}

class HTML extends WebElement {

  constructor() {
    super(null)
  }

  get() {
    return cy.root()
  }

}
import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

export default class LoginPage extends WebElement {

  loginPage = `${htmlElements.div}.LoginPage`;

  constructor(parent) {
    super(parent);
    this.loginForm = new LoginForm(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.loginPage);
  }

  getLoginForm() {
    return this.loginForm;
  }

  login(userData) {
    const loginForm = this.getLoginForm();
    loginForm.login(userData);
  }

}

class LoginForm extends WebElement {

  formWrapper = `${htmlElements.div}.LoginPage__formWrapper`;
  form = `${htmlElements.form}.LoginPage__form`;
  username = "#username";
  password = "#password";
  submitButton = ".LoginPage__button[type=submit]";

  get() {
    return this.parent.get()
               .children(this.formWrapper)
               .children(this.form);
  }

  getUsername() {
    return this.get()
               .find(this.username);
  }

  getPassword() {
    return this.get()
               .find(this.password);
  }

  getSubmitButton() {
    return this.get()
               .find(this.submitButton);
  }

  typeUsername(input) {
    this.getUsername().type(input);
  }

  typePassword(input) {
    this.getPassword().type(input);
  }

  submitForm() {
    this.getSubmitButton().click();
  }

  login(userData) {
    this.typeUsername(userData.username);
    this.typePassword(userData.password);
    this.submitForm();
  }

}
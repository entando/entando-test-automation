import {htmlElements, WebElement} from '../WebElement.js';

export default class LoginPage extends WebElement {

  loginPage = `${htmlElements.div}.LoginPage`;

  constructor(parent) {
    super(parent);
    this.loginForm = new LoginForm(this);
    this.passwordUpdateForm = new PasswordUpdateForm(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.loginPage);
  }

  getLoginForm() {
    return this.loginForm;
  }

  getPasswordUpdateForm() {
    return this.passwordUpdateForm;
  }

  login(userData) {
    const loginForm = this.getLoginForm();
    loginForm.login(userData);
  }

  confirmPassword(userData) {
    const passwordUpdateForm = this.getPasswordUpdateForm();
    passwordUpdateForm.confirmPassword(userData.password);
  }

}

class LoginForm extends WebElement {

  formWrapper  = `${htmlElements.div}.LoginPage__formWrapper`;
  form         = `${htmlElements.form}.LoginPage__form`;
  username     = '#username';
  password     = '#password';
  submitButton = '.LoginPage__button[type=submit]';

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

class PasswordUpdateForm extends WebElement {

  formWrapper        = `${htmlElements.div}.LoginPage__formWrapper`;
  form               = `${htmlElements.form}#kc-passwd-update-form`;
  newPassword        = `${htmlElements.input}#password-new`;
  newPasswordConfirm = `${htmlElements.input}#password-confirm`;
  newPasswordSubmit  = `${htmlElements.input}.btn[type=submit]`;

  get() {
    return this.parent.get()
               .children(this.formWrapper)
               .children(this.form);
  }

  getNewPassword() {
    return this.get()
               .find(this.newPassword);
  }

  getNewPasswordConfirm() {
    return this.get()
               .find(this.newPasswordConfirm);
  }

  getNewPasswordSubmit() {
    return this.get()
               .find(this.newPasswordSubmit);
  }

  typeNewPassword(input) {
    this.getNewPassword().type(input);
  }

  typeNewPasswordConfirm(input) {
    this.getNewPasswordConfirm().type(input);
  }

  submitNewPassword() {
    this.getNewPasswordSubmit().click();
  }

  confirmPassword(password) {
    this.typeNewPassword(password);
    this.typeNewPasswordConfirm(password);
    this.submitNewPassword();
  }

}

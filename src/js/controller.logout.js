class LogoutController {
  constructor(Auth, Page) {
    this.Page = Page;
    this.Auth = Auth;

    this.user = Auth.getUser();
  }

  logout() {
    this.Auth.logout();
  }
}

angular.module('crucioApp').controller('LogoutController', LogoutController);

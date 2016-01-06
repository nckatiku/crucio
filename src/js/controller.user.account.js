class AccountController {
  constructor(Page, Auth, API, $scope) {
    this.API = API;
    this.Auth = Auth;
    this.$scope = $scope;

    Page.setTitleAndNav('Account | Crucio', 'Name');

    this.user = this.Auth.getUser();
  }

  formChanged() {
    this.$scope.form.passwordc.$setValidity('confirm', this.password === this.passwordc);
  }

  saveUser() {
    this.isSaved = false;
    this.hasError = false;

    this.isWorking = true;

    const data = {
      email: this.user.email.replace('@', '(@)'),
      course_id: this.user.course_id,
      semester: this.user.semester,
      current_password: this.old_password,
      password: this.new_password,
    };
    this.API.put('users/' + this.user.user_id + '/account', data, true).success(result => {
      if (result.status) {
        this.Auth.setUser(this.user);
        this.isSaved = true;
      } else {
        this.user = this.Auth.getUser();
        this.isSaved = false;
        this.hasError = true;
      }

      this.wrong_password = (result.error === 'error_incorrect_password');
      this.isWorking = false;
    });
  }
}

angular.module('crucioApp').controller('AccountController', AccountController);

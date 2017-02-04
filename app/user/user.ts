class UserController {
  readonly API: APIService;
  readonly Auth: AuthService;
  readonly $scope: any; // Property form does not exist
  readonly $uibModal: angular.ui.bootstrap.IModalService;
  user: Crucio.User;
  isWorking: boolean;
  isSaved: boolean;
  hasError: boolean;
  wrongPassword: boolean;
  oldPassword: string;
  newPassword: string;
  newPasswordC: string;

  constructor(Page: PageService, Auth: AuthService, API: APIService, $scope: angular.IScope, $uibModal: angular.ui.bootstrap.IModalService) {
    this.API = API;
    this.Auth = Auth;
    this.$scope = $scope;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Account | Crucio', 'User');

    this.user = this.Auth.getUser();
  }

  formChanged(): void {
    this.isSaved = false;
    this.hasError = false;

    this.$scope.form.passwordc.$setValidity('confirm', this.newPassword === this.newPasswordC);
  }

  saveUser(): void {
    this.formChanged();

    this.isWorking = true;

    const data = {
      course_id: this.user.course_id,
      semester: this.user.semester,
      current_password: this.oldPassword,
      password: this.newPassword,
    };
    this.API.put(`users/${this.user.user_id}/account`, data, true).then(result => {
      if (result.data.status) {
        this.Auth.setUser(this.user);
      } else {
        this.user = this.Auth.getUser();
        this.hasError = true;
      }

      this.isSaved = result.data.status;
      this.wrongPassword = (result.data.error === 'error_incorrect_password');
      this.isWorking = false;
    });

    const dataSettings = {
      highlightExams: this.user.highlightExams,
      showComments: this.user.showComments,
      repetitionValue: 50,
      useAnswers: this.user.useAnswers,
      useTags: this.user.useTags,
    };
    this.API.put(`users/${this.user.user_id}/settings`, dataSettings, true).then(result => {
      if (result.data.status) {
        this.Auth.setUser(this.user);
      } else {
        this.user = this.Auth.getUser();
        this.hasError = true;
      }

      this.isSaved = result.data.status;
      this.isWorking = false;
    });
  }

  deleteAllResultsModal(): void {
    this.$uibModal.open({
      component: 'deleteResultsModalComponent',
      resolve: {
        userId: () => this.user.user_id,
      },
    });
  }

  deleteAllTagsModal(): void {
    this.$uibModal.open({
      component: 'deleteTagsModalComponent',
      resolve: {
        userId: () => this.user.user_id,
      },
    });
  }
}

angular.module('crucioApp').component('usercomponent', {
  templateUrl: 'app/user/user.html',
  controller: UserController,
});

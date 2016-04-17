class SettingsController {
  API: API;
  Auth: Auth;
  user: User;
  isWorking: boolean;
  hasError: boolean;
  isSaved: boolean;

  constructor(Page, Auth, API) {
    this.API = API;
    this.Auth = Auth;

    Page.setTitleAndNav('Einstellungen | Crucio', 'Name');

    this.user = this.Auth.getUser();
  }

  formChanged(): void {
    this.isSaved = false;
    this.hasError = false;
  }

  updateUser(): void {
    this.formChanged();

    this.isWorking = true;

    const data = {
      highlightExams: this.user.highlightExams,
      showComments: this.user.showComments,
      repetitionValue: 50,
      useAnswers: this.user.useAnswers,
      useTags: this.user.useTags,
    };

    this.API.put(`users/${this.user.user_id}/settings`, data, true).then(result => {
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

  removeAllResults(): void {
    this.API.delete(`results/${this.user.user_id}`);
  }
}

angular.module('crucioApp').component('settingscomponent', {
  templateUrl: 'app/user/settings.html',
  controller: SettingsController,
});
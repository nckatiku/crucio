import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import PageService from './../../services/page.service';

class AdminActivityController {
  private updateActivity: boolean;
  private showActivity: any;
  private activities: any;

  constructor(Page: PageService, Auth: AuthService, private readonly API: APIService, $interval: angular.IIntervalService) {
    Page.setTitleAndNav('Statistik | Crucio', 'Admin');

    this.updateActivity = false;
    this.showActivity = {
      result: true,
      login: true,
      register: true,
      comment: true,
      examNew: true,
      examUpdate: true,
    };

    $interval(() => {
      if (this.updateActivity) {
        this.loadActivity();
      }
    }, 2500);

    this.loadActivity();
  }

  loadActivity(): void {
    const showActivityBoolean = {
      result: this.showActivity.result | 0,
      login: this.showActivity.login | 0,
      register: this.showActivity.register | 0,
      comment: this.showActivity.comment | 0,
      examNew: this.showActivity.examNew | 0,
      examUpdate: this.showActivity.examUpdate | 0,
    };
    this.API.get('stats/activities', showActivityBoolean).then(result => {
      this.activities = result.data.activities;
    });
  }
}

export const AdminActivityComponent = 'adminactivityComponent';
app.component(AdminActivityComponent, {
  templateUrl: 'app/admin/activity/activity.html',
  controller: AdminActivityController,
});

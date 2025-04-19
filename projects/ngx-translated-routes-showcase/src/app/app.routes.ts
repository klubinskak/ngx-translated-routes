import { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { MyProfileDetailsComponent } from './pages/my-profile-details/my-profile-details.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { UsersComponent } from './pages/users/users.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'settings',
    component: MyProfileComponent,
    children: [
      {
        path: 'preferences',
        component: MyProfileDetailsComponent,
      },
    ]
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/:id',
    component: UsersComponent,
  },
  { path: '**', component: NotFoundComponent }
];

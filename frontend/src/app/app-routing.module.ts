import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './user/profile/profile.component';


const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./feed/feed.module').then(m => m.FeedModule)
  // },
  {
    path: '',
    canActivate: [AuthGuard],
    component : HomepageComponent

  },
  {
    path : ':username',
    canActivate: [AuthGuard],
    component:ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

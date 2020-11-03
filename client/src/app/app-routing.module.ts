import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import {
//   NbAuthComponent,
//   NbLoginComponent,
//   NbLogoutComponent,
//   NbRegisterComponent,
//   NbRequestPasswordComponent,
//   NbResetPasswordComponent,
// } from '@nebular/auth';
// import { LogInComponent } from './pages/online/log-in/log-in.component';
// import { SecureInnerPagesGuard } from "./guard/secure-inner-pages.guard";
// import { AuthGuard } from "./guard/auth.guard";
// import { AdminGuard } from "./guard/admin.guard";
// import { Service1Guard } from "./guard/service1.guard";

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  // {
  //   path: 'auth',
  //   component: LogInComponent
    // children: [
    //   {
    //     path: '',
    //     component: LogInComponent,
    //   },
    //   {
    //     path: 'login',
    //     component: LogInComponent,
    //   },
    //   {
    //     path: 'register',
    //     component: NbRegisterComponent,
    //   },
    //   {
    //     path: 'logout',
    //     component: NbLogoutComponent,
    //   },
    //   {
    //     path: 'request-password',
    //     component: NbRequestPasswordComponent,
    //   },
    //   {
    //     path: 'reset-password',
    //     component: NbResetPasswordComponent,
    //   },
    // ],
  // },
  { path: '', redirectTo: 'pages/sign-in', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages/sign-in' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

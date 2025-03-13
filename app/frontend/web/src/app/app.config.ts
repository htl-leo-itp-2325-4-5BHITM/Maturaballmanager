import {ApplicationConfig} from "@angular/core";
import {provideRouter, Route} from "@angular/router";
import {DashboardViewComponent} from "./pages/dashboard-view/dashboard-view.component";
import {provideAnimations, provideNoopAnimations} from "@angular/platform-browser/animations";
import {LoginComponent} from "./pages/login/login.component";
import {authGuard} from "./guards/auth.guard";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {CompanyManagementComponent} from "./pages/company-management/company-management.component";
import {BenefitManagementComponent} from "./pages/benefit-management/benefit-management.component";
import {InvoiceManagementComponent} from "./pages/invoice-management/invoice-management.component";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideNebular} from "./nebular.providers";
import {UserManagementComponent} from "./pages/user-management/user-management.component";
import {MaturaballComponent} from "./pages/maturaball/maturaball.component";

import {
  NbCalendarMonthModelService,
  NbCalendarYearModelService,
  NbDialogModule,
  NbDialogService,
  NbMenuModule,
  NbSidebarService,
  NbThemeModule,
  NbToastrModule
} from "@nebular/theme";
import { importProvidersFrom } from "@angular/core";
import {NgxEchartsModule} from "ngx-echarts";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {AppointmentsComponent} from "./pages/appointments/appointments.component";

const routes: Route[] = [
  { path: '', redirectTo: '/login', pathMatch: 'full', data: { roles: [] } },
  { path: 'login', component: LoginComponent, data: { roles: [] } },
  { path: 'dashboard', component: DashboardViewComponent, canActivate: [authGuard], data: { roles: [] } },
  { path: 'sponsoring', data: {roles: ["supervisor", "sponsoring", "management", "organization"]},children: [
      { path: 'companies', component: CompanyManagementComponent, canActivate: [authGuard] },
      { path: 'benefits', component: BenefitManagementComponent, canActivate: [authGuard] },
      { path: 'invoices', component: InvoiceManagementComponent, canActivate: [authGuard] },
    ]},
  { path: 'settings', data: {roles: ["management", "supervisor"]}, children: [
      { path: 'users', component: UserManagementComponent, canActivate: [authGuard] },
      { path: 'appointment', component: MaturaballComponent, canActivate: [authGuard] }
    ]},
    /*{ path: 'organisation', data: {roles: ["management", "supervisor","organization"]}, children: [
      { path: 'todo', component: DashboardViewComponent, canActivate: [authGuard] },
      { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard] }
    ]},*/
  //{ path: '**', redirectTo: '/dashboard' },
];

/*
{ path: 'organisation', data: {roles: ["management", "supervisor","organization"]}, children: [
      { path: 'todo', component: DashboardViewComponent, canActivate: [authGuard] },
      { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard] }
    ]},
 */

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNoopAnimations(),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(),
    provideMomentDateAdapter(),
    provideNebular(),
    importProvidersFrom(
        NbThemeModule.forRoot({ name: 'default' }),
        NbToastrModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDialogModule.forRoot(),
        NbEvaIconsModule,
        NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
    ),
    NbSidebarService,
    NbDialogService,
    NbCalendarYearModelService,
    NbCalendarMonthModelService,
  ]
}

export const config = {
  navigation: {
    items: [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/dashboard'
      },
      /*{
        title: 'Organisation',
        icon: 'people-outline',
        link: '/organisation',
        roles: ["supervisor", "sponsoring", "management", "organization"],
        children: [
          {
            title: 'ToDo',
            link: '/organisation/todo'
          },
          {
            title: 'Termine',
            link: '/organisation/appointments'
          }
        ]
      },
      {
        title: 'Veranstaltungsort',
        icon: 'map-outline',
        link: '/location',
        children: [
          {
            title: 'Säle',
            children: [
              {
                title: 'Übersicht',
                link: '/rooms'
              },
              {
                title: 'Tische',
                link: '/tables'
              }
            ]
          },
          {
            title: 'Dekoration',
            link: '/decoration'
          }
        ]
      },
      {
        title: 'Verkauf',
        icon: 'shopping-cart-outline',
        link: '/sales',
        children: [
          {
            title: 'Eintrittskarten',
            link: '/tickets'
          },
          {
            title: 'Tischplätze',
            link: '/tables'
          }
        ]
      },*/
      {
        title: 'Sponsoring',
        icon: 'award-outline',
        link: '/sponsoring',
        roles: ["supervisor", "sponsoring", "management", "organization"],
        children: [
          {
            title: 'Unternehmen',
            link: '/sponsoring/companies'
          },
          {
            title: 'Rechnungen',
            link: '/sponsoring/invoices'
          },
          {
            title: 'Gegenleistungen',
            link: '/sponsoring/benefits'
          }
        ]
      },
      {
        title: 'Administrativa',
        icon: 'settings-2-outline',
        link: '/settings',
        roles: ["management", "supervisor"],
        children: [
          {
            title: 'Benutzerverwaltung',
            link: '/settings/users'
          },
          {
            title: 'Maturaball',
            link: '/settings/appointment'
          }
        ]
      }
    ]
  }
}

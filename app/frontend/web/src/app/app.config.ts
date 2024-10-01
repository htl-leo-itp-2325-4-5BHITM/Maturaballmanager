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
import {NbDatepickerAdapter} from "@nebular/theme";

const routes: Route[] = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardViewComponent, canActivate: [authGuard] },
  { path: 'sponsoring', children: [
      { path: 'companies', component: CompanyManagementComponent, canActivate: [authGuard] },
      { path: 'benefits', component: BenefitManagementComponent, canActivate: [authGuard] },
      { path: 'invoices', component: InvoiceManagementComponent, canActivate: [authGuard] },
    ]},
  { path: '**', redirectTo: '/dashboard' },
];


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideNoopAnimations(), provideAnimations(), provideHttpClient(withInterceptors([authInterceptor])), provideNativeDateAdapter()],
}

export const config = {
  navigation: {
    items: [
      {
        title: 'Dashboard',
        icon: 'home-outline',
        link: '/dashboard'
      },
      {
        title: 'Organisation',
        icon: 'people-outline',
        children: [
          {
            title: 'ToDo'
          },
          {
            title: 'Termine'
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
      },
      {
        title: 'Sponsoring',
        icon: 'award-outline',
        link: '/sponsoring',
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
        children: [
          {
            title: 'Benutzerverwaltung',
            link: '/users'
          },
          {
            title: 'Maturaball',
            link: '/appointment'
          },
          {
            title: 'Reports',
            link: '/reports'
          }
        ]
      }
    ]
  }
}


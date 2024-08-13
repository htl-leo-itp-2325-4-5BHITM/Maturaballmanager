import {ApplicationConfig} from "@angular/core";
import {provideRouter, Route} from "@angular/router";
import {DashboardViewComponent} from "./pages/dashboard-view/dashboard-view.component";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

let routes: Route[] = [
  {
    path: '**',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: DashboardViewComponent
  },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideNoopAnimations()],
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
            link: '/companies'
          },
          {
            title: 'Rechnungen',
            link: '/receipts'
          },
          {
            title: 'Gegenleistungen',
            link: '/services'
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


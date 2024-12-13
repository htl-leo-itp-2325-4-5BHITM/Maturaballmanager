import {Component} from "@angular/core";
import {
  NbActionsModule,
  NbIconLibraries,
  NbLayoutModule,
  NbSidebarModule,
  NbSidebarService,
  NbThemeService
} from "@nebular/theme";
import {NavigationBarComponent} from "./components/navigation-bar/navigation-bar.component";
import {Router, RouterOutlet} from "@angular/router";
import {provideNebular} from "./nebular.providers";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    NbLayoutModule,
    NavigationBarComponent,
    NbActionsModule,
    RouterOutlet,
    NbSidebarModule,
    NgIf
  ],
  providers: [NbSidebarService, NbThemeService, provideNebular()],
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  showLayout: boolean = true;

  constructor(private sidebarService: NbSidebarService, private router: Router, private iconLibraries: NbIconLibraries) {
    this.router.events.subscribe(() => {
      this.showLayout = this.router.url !== '/login';
    });
    this.iconLibraries.setDefaultPack('eva');
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

    protected readonly Router = Router;

  backToLogin() {
    this.router.navigate(['/login']);
  }
}

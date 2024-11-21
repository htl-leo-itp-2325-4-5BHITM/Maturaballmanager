import { Component } from "@angular/core";
import { NbActionsModule, NbLayoutModule, NbSidebarModule, NbSidebarService, NbThemeService } from "@nebular/theme";
import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";
import { RouterOutlet, Router } from "@angular/router";
import { AppModule } from "./app.module";
import { provideNebular } from "./nebular.providers";
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
    AppModule,
    NgIf
  ],
  providers: [NbSidebarService, NbThemeService, provideNebular()],
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  showLayout: boolean = true;

  constructor(private sidebarService: NbSidebarService, private router: Router) {
    this.router.events.subscribe(() => {
      this.showLayout = this.router.url !== '/login';
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }
}

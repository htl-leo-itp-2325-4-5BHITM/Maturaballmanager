import {Component} from "@angular/core";
import {NbActionsModule, NbLayoutModule, NbSidebarModule, NbSidebarService, NbThemeService} from "@nebular/theme";
import {NavigationBarComponent} from "./components/navigation-bar/navigation-bar.component";
import {RouterOutlet} from "@angular/router";
import {AppModule} from "./app.module";
import {provideNebular} from "./nebular.providers";

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
    AppModule
  ],
  providers: [NbSidebarService, NbThemeService, provideNebular()],
  styleUrl:  'app.component.scss'
})
export class AppComponent {
  title = 'my-app';

  constructor(private sidebarService: NbSidebarService) {}

  toggleSidebar() {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }
}

import {Component, Inject} from '@angular/core';
import {NbMenuItem, NbMenuModule, NbSidebarModule, NbSidebarService} from "@nebular/theme";
import {config} from "../../app.config";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    NbMenuModule,
    NbSidebarModule
  ],
  providers: [],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  protected items: NbMenuItem[]

  constructor() {
    this.items = config.navigation.items;
  }
}

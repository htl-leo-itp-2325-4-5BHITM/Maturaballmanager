import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DashboardAreaComponent} from "./components/general/dashboard-area/dashboard-area.component";
import {HeaderComponentComponent} from "./components/general/header-component/header-component.component";
import {SponsorshipTableComponent} from "./components/sponsorship/sponsorship-table/sponsorship-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardAreaComponent, HeaderComponentComponent, SponsorshipTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'newMBMfrontend';
  apiURL = 'http://localhost:8080';
}

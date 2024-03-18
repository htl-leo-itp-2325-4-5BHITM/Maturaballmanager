import { Component } from '@angular/core';
import {SponsorshipTableComponent} from "../../sponsorship/sponsorship-table/sponsorship-table.component";

@Component({
  selector: 'app-dashboard-area',
  standalone: true,
  imports: [SponsorshipTableComponent],
  templateUrl: './dashboard-area.component.html',
  styleUrl: './dashboard-area.component.scss'
})
export class DashboardAreaComponent {

}

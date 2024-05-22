import { Component } from '@angular/core';
import {SponsorshipListComponent} from "./sponsorship-list/sponsorship-list.component";

@Component({
  selector: 'app-sponsorship',
  standalone: true,
  imports: [
    SponsorshipListComponent
  ],
  templateUrl: './sponsorship.component.html',
  styleUrl: './sponsorship.component.scss'
})
export class SponsorshipComponent {

}

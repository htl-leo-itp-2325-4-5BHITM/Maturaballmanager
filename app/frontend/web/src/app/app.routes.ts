import { Routes } from '@angular/router';
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SponsorshipComponent} from "./components/sponsorship/sponsorship.component";

export const routes: Routes = [
    {path: "", component: DashboardComponent},
    {path: "sponsorship", component: SponsorshipComponent},
    {path: "**", component: PageNotFoundComponent},
];

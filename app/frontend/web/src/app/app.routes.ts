import { Routes } from '@angular/router';
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SponsorshipComponent } from "./components/sponsorship/sponsorship.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
    { path: "", redirectTo: "/dashboard", pathMatch: "full" },
    { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
    { path: "sponsorship", component: SponsorshipComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "**", component: PageNotFoundComponent }
];
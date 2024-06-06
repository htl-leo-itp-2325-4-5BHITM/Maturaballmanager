<<<<<<< HEAD
import { Routes } from '@angular/router';
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { SponsorshipComponent } from "./components/sponsorship-old/sponsorship.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { SponsorshipListComponent } from "./sponsoren/sponsoren.component";
import {BudgetComponent} from "./budget/budget.component"; // Corrected import
=======
import {Routes} from '@angular/router';
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {SponsorshipComponent} from "./components/sponsorship-old/sponsorship.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {SponsorshipListComponent} from "./sponsoren/sponsoren.component";
import {InvoiceComponent} from "./invoice/invoice.component"; // Corrected import
>>>>>>> 9ddb5fb1789caca1419f7c81b6c280e72588fdbf

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "", redirectTo: "/dashboard", pathMatch: "full"},
    {path: 'sponsor', component: SponsorshipListComponent}, // Corrected component name
    {path: 'invoice', component: InvoiceComponent},
    // { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
<<<<<<< HEAD
    { path: "sponsorship", component: SponsorshipComponent, canActivate: [AuthGuard] },
    { path: "**", component: PageNotFoundComponent },
    {path: "budget", component: BudgetComponent}
=======
    {path: "sponsorship", component: SponsorshipComponent, canActivate: [AuthGuard]},
    {path: "**", component: PageNotFoundComponent},
>>>>>>> 9ddb5fb1789caca1419f7c81b6c280e72588fdbf
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SponsorenComponent} from "./sponsoren/sponsoren.component";

const routes: Routes = [
  {
    component: SponsorenComponent,
    path: 'sponsoren'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

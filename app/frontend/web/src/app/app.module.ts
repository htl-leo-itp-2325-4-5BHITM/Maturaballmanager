import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbActionsModule, NbButtonModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbSidebarService,
  NbThemeModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {NgxEchartsModule} from "ngx-echarts";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({name: 'default'}),
    NbActionsModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbLayoutModule,
    NbButtonModule,
    NbEvaIconsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers: [NbSidebarService]
})
export class AppModule {
}

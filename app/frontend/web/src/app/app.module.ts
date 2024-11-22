import {NgModule} from '@angular/core';
import {
    NbButtonModule, NbCalendarMonthModelService, NbCalendarYearModelService,
    NbCardModule, NbDialogModule, NbDialogService,
    NbInputModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarService,
    NbThemeModule,
    NbToastrModule
} from "@nebular/theme";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {NgxEchartsModule} from "ngx-echarts";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        NbThemeModule.forRoot({name: 'default'}),
        NbToastrModule.forRoot(),
        NbMenuModule.forRoot(),
        NbLayoutModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        NbDialogModule.forRoot(),
        NgxEchartsModule,
        NbEvaIconsModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
    ],
    providers: [
        NbSidebarService,
        NbDialogService,
        NbCalendarYearModelService,
        NbCalendarMonthModelService,
    ]
})
export class AppModule {
}

import {
    NbDatepickerModule,
    NbDateService,
    NbNativeDateService,
} from "@nebular/theme";

export function provideNebular() {
    return [
        NbDatepickerModule.forRoot().providers,
        {provide: NbDateService, useClass: NbNativeDateService},
    ];
}
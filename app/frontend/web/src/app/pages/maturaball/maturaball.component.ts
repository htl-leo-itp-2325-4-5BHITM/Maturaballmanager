import {Component, OnInit} from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogService,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbToastrService
} from "@nebular/theme";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PromService} from "../../services/prom.service";
import {DayPlanDTO, PromDTO} from "../../model/dtos/prom.dto";
import {NgForOf, NgIf} from "@angular/common";
import {ConfirmDialogComponent} from "../../components/dialogs/confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'app-maturaball',
    standalone: true,
    imports: [
        NbFormFieldModule,
        NbIconModule,
        NbCardModule,
        NbButtonModule,
        NbInputModule,
        ReactiveFormsModule,
        FormsModule,
        NgForOf,
        NgIf
    ],
    templateUrl: './maturaball.component.html',
    styleUrl: './maturaball.component.scss'
})
export class MaturaballComponent implements OnInit {
    formData: PromDTO = {
        motto: '',
        date: '',
        time: '',
        street: '',
        houseNumber: '',
        zip: '',
        city: '',
        dayPlan: []
    };

    editingExistingProm = false;
    activePromId: string | null = null;

    constructor(private promService: PromService, private toastrService: NbToastrService, private dialogService: NbDialogService,) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const activeProm: any = await this.promService.getActiveProm();
            if (activeProm && activeProm.id) {
                this.editingExistingProm = true;
                this.activePromId = activeProm.id;

                this.formData.motto = activeProm.name;
                this.formData.date = activeProm.date;
                this.formData.time = activeProm.time;
                this.formData.street = activeProm.address.street;
                this.formData.houseNumber = activeProm.address.houseNumber;
                this.formData.zip = activeProm.address.postalCode;
                this.formData.city = activeProm.address.city;

                if (activeProm.dayPlan) {
                    this.formData.dayPlan = activeProm.dayPlan.map((entry: DayPlanDTO) => {
                        if (entry) {
                            return {name: entry.name, time: entry.time};
                        }
                        return {name: '', time: ''};
                    }).filter((entry: DayPlanDTO) => entry.name || entry.time);
                }

            } else {
                this.editingExistingProm = false;
                this.activePromId = null;
                this.formData.dayPlan = [];
            }
        } catch (err) {
            this.editingExistingProm = false;
        }
    }

    addDayPlanEntry(): void {
        this.formData.dayPlan.push({name: '', time: ''});
    }

    removeDayPlanEntry(index: number): void {
        this.formData.dayPlan.splice(index, 1);
    }

    async submit(): Promise<void> {
        const {motto, date, time, street, houseNumber, zip, city} = this.formData;

        if (!motto || !date || !time || !street || !houseNumber || !zip || !city) {
            this.toastrService.show(
                'Bitte füllen Sie alle Pflichtfelder aus.',
                'Fehlende Angaben',
                {status: 'warning', duration: 3000}
            );
            return;
        }

        try {
            if (this.activePromId) this.formData.dayPlan = this.formData.dayPlan.filter((entry: any) => entry.name && entry.time);
            if (this.activePromId) {
                await this.promService.updateProm(this.activePromId, this.formData);
            } else {
                await this.promService.createProm(this.formData);
            }

            this.formData.dayPlan = this.formData.dayPlan.sort((a: any, b: any) => a.time.localeCompare(b.time));

            this.toastrService.show(
                'Maturaball-Daten wurden erfolgreich gespeichert!',
                'Erfolg',
                {status: 'success', duration: 3000}
            );
        } catch (err) {
            this.toastrService.show(
                'Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.',
                'Speicherfehler',
                {status: 'danger', duration: 3000}
            );
        }
    }

    async closeEvent(): Promise<void> {
        if (this.activePromId) {
            const confirmed = await this.dialogService
                .open(ConfirmDialogComponent, {
                    context: {
                        title: 'Maturaball schließen',
                        message: 'Sind Sie sicher, dass Sie den aktuellen Maturaball schließen möchten?'
                    }
                })
                .onClose.toPromise();


            if (!confirmed) {
                return;
            }

            try {
                await this.promService.deactivateProm(this.activePromId);

                this.toastrService.show(
                    'Der aktuelle Maturaball wurde geschlossen. Nun kann ein neuer erstellt werden.',
                    'Erfolg',
                    { status: 'success', duration: 3000 }
                );

                this.editingExistingProm = false;
                this.activePromId = null;
                this.formData = {
                    motto: '',
                    date: '',
                    time: '',
                    street: '',
                    houseNumber: '',
                    zip: '',
                    city: '',
                    dayPlan: []
                };
            } catch (err) {
                this.toastrService.show(
                    'Fehler beim Schließen. Bitte versuchen Sie es erneut.',
                    'Fehler',
                    { status: 'danger', duration: 3000 }
                );
            }
        } else {
            this.toastrService.show(
                'Kein aktiver Maturaball zum Schließen vorhanden.',
                'Info',
                { status: 'info', duration: 3000 }
            );
        }
    }
}
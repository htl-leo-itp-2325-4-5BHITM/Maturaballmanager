import { Component, OnInit } from '@angular/core';
import { BenefitService } from '../../services/benefit.service';
import {
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbOptionModule,
  NbSelectModule,
  NbToastrService,
  NbTooltipModule,
} from '@nebular/theme';
import { Benefit } from '../../model/benefit';
import { NgxPaginationModule } from 'ngx-pagination';
import { BenefitDialogComponent } from '../../components/dialogs/benefit-dialog/benefit-dialog.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import {ReportComponent} from "../../components/report/report.component";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-benefit-management',
  templateUrl: './benefit-management.component.html',
  styleUrls: ['./benefit-management.component.scss'],
  standalone: true,
  imports: [
    NgxPaginationModule,
    NbOptionModule,
    NbSelectModule,
    NbIconModule,
    NbButtonModule,
    NbTooltipModule,
    CurrencyPipe,
    NgForOf,
    NgIf,
    NbFormFieldModule,
    NbCardModule,
    NbInputModule,
    BenefitDialogComponent,
    ConfirmDialogComponent,
    ReportComponent,
  ],
})
export class BenefitManagementComponent implements OnInit {
  benefits: Benefit[] = [];
  columns = [
    { key: 'name', title: 'Name der Leistung', sortable: true },
    { key: 'description', title: 'Beschreibung' },
    {
      key: 'price',
      title: 'Preis (€)',
      sortable: true,
      format: (value: any) => (value ? `${value.toFixed(2)} €` : '—'),
    },
  ];

  actions = [
    {
      icon: 'trash-2-outline',
      tooltip: 'Gegenleistung löschen',
      status: 'danger',
      callback: this.confirmDelete.bind(this),
    },
  ];

  constructor(
      private benefitService: BenefitService,
      private dialogService: NbDialogService,
      private toastrService: NbToastrService
  ) {}

  ngOnInit(): void {
    this.loadBenefits();
  }

  loadBenefits(): void {
    this.benefitService.getBenefits().subscribe({
      next: (benefits) => {
        this.benefits = benefits;
      },
      error: (err) => {
        this.toastrService.danger('Fehler beim Laden der Gegenleistungen', 'Fehler');
        console.error(err);
      },
    });
  }

  openCreateDialog(): void {
    this.dialogService
        .open(BenefitDialogComponent, {
          context: {
            title: 'Gegenleistung erstellen',
          },
        })
        .onClose.subscribe((result: Benefit | undefined) => {
      if (result) {
        this.benefitService.addBenefit(result).subscribe(() => {
          this.loadBenefits();
          this.toastrService.success('Gegenleistung erfolgreich erstellt.', 'Erfolg');
        })
      }
    });
  }

  openEditDialog(benefit: Benefit): void {
    this.dialogService
        .open(BenefitDialogComponent, {
          context: {
            title: 'Gegenleistung bearbeiten',
            benefit: { ...benefit },
          },
        })
        .onClose.subscribe((result: Benefit | undefined) => {
      if (result) {
        console.log(result)
        this.benefitService.updateBenefit(result).subscribe(() => {
          this.loadBenefits();
          this.toastrService.success('Gegenleistung erfolgreich aktualisiert.', 'Erfolg');
        })
      }
    });
  }

  confirmDelete(benefit: Benefit): void {
    this.dialogService
        .open(ConfirmDialogComponent, {
          context: {
            title: 'Löschen bestätigen',
            message: `Möchten Sie die Gegenleistung "${benefit.name}" wirklich löschen?`,
          },
        })
        .onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.benefitService.deleteBenefit(benefit.id!).subscribe({
          next: () => {
            this.loadBenefits();
            this.toastrService.success('Gegenleistung erfolgreich gelöscht.', 'Erfolg');
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.status)
            if(error.status === 409) {
                this.toastrService.danger('Die Gegenleistung kann nicht gelöscht werden, da sie in einer Rechnung verwendet wird.', 'Fehler');
            } else {
              this.toastrService.danger('Fehler beim Löschen der Gegenleistung.', 'Fehler');
            }
          },
        });
      }
    });
  }
}
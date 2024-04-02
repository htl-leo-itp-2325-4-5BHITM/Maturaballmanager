import { Component, Input, OnInit } from '@angular/core';
import {NgIf, NgSwitch} from "@angular/common";
import {ModalStatusService} from "../../../../services/modal/modal.service"; // Pfad entsprechend anpassen

@Component({
  selector: 'app-off-canvas-modal',
  templateUrl: './modal-structure.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch
  ],
  styleUrls: ['./modal-structure.component.css']
})
export class ModalStructureComponent implements OnInit {
  @Input() showProgress: boolean = false;
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 3;
  showModal: boolean = false;
  private mode: string = '';

  constructor(private modalStatusService: ModalStatusService) { }

  ngOnInit() {
    this.modalStatusService.showModal$.subscribe((show: boolean) => this.showModal = show);
  }

  closeModal() {
    this.modalStatusService.closeModal();
  }

  get progressIndicator() {
    let indicator = '';
    for (let i = 1; i <= this.totalSteps; i++) {
      indicator += i <= this.currentStep ? '● ' : '○ ';
    }
    return indicator.trim();
  }

  get getMode() {
    return this.mode;
  }
}

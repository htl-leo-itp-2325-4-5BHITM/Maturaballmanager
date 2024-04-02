import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceModalComponent } from './add-invoice-modal.component';

describe('AddInvoiceModalComponent', () => {
  let component: AddInvoiceModalComponent;
  let fixture: ComponentFixture<AddInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInvoiceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

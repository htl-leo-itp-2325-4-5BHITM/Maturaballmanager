import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStructureComponent } from './modal-structure.component';

describe('ModalStructureComponent', () => {
  let component: ModalStructureComponent;
  let fixture: ComponentFixture<ModalStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalStructureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

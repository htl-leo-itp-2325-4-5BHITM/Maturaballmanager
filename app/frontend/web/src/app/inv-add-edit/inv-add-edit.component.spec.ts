import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvAddEditComponent } from './inv-add-edit.component';

describe('InvAddEditComponent', () => {
  let component: InvAddEditComponent;
  let fixture: ComponentFixture<InvAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvAddEditComponent]
    });
    fixture = TestBed.createComponent(InvAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

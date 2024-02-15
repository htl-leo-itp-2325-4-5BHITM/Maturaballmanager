import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOverviewItemComponent } from './company-overview-item.component';

describe('CompanyOverviewItemComponent', () => {
  let component: CompanyOverviewItemComponent;
  let fixture: ComponentFixture<CompanyOverviewItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyOverviewItemComponent]
    });
    fixture = TestBed.createComponent(CompanyOverviewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

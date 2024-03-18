import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipTableItemComponent } from './sponsorship-table-item.component';

describe('SponsorshipTableItemComponent', () => {
  let component: SponsorshipTableItemComponent;
  let fixture: ComponentFixture<SponsorshipTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorshipTableItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SponsorshipTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

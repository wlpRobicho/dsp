import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyDialogComponent } from './loyalty-dialog.component';

describe('LoyaltyDialogComponent', () => {
  let component: LoyaltyDialogComponent;
  let fixture: ComponentFixture<LoyaltyDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoyaltyDialogComponent]
    });
    fixture = TestBed.createComponent(LoyaltyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

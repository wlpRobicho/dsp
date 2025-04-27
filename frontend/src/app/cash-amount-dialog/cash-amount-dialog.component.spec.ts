import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAmountDialogComponent } from './cash-amount-dialog.component';

describe('CashAmountDialogComponent', () => {
  let component: CashAmountDialogComponent;
  let fixture: ComponentFixture<CashAmountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashAmountDialogComponent]
    });
    fixture = TestBed.createComponent(CashAmountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

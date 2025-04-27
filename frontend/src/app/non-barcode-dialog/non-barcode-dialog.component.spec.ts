import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonBarcodeDialogComponent } from './non-barcode-dialog.component';

describe('NonBarcodeDialogComponent', () => {
  let component: NonBarcodeDialogComponent;
  let fixture: ComponentFixture<NonBarcodeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonBarcodeDialogComponent]
    });
    fixture = TestBed.createComponent(NonBarcodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

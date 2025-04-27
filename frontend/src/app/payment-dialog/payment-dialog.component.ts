import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent {
  constructor(public dialogRef: MatDialogRef<PaymentDialogComponent>) {}

  selectPayment(method: 'cash' | 'card') {
    this.dialogRef.close(method);
  }
}

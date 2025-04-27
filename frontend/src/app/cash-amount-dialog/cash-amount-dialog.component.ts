import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cash-amount-dialog',
  templateUrl: './cash-amount-dialog.component.html',
  styleUrls: ['./cash-amount-dialog.component.css']
})
export class CashAmountDialogComponent {
  amountReceived: string = '';
  shake = false;

  constructor(
    public dialogRef: MatDialogRef<CashAmountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { total: number },
    private snackBar:MatSnackBar
  ) {}

  append(digit: string) {
    this.amountReceived += digit;
  }

  backspace() {
    this.amountReceived = this.amountReceived.slice(0, -1);
  }

  clear() {
    this.amountReceived = '';
  }

  confirm() {
    const amount = parseFloat(this.amountReceived);
    if (isNaN(amount) || amount < this.data.total) {
      this.triggerShake();
      this.snackBar.open(`Amount must be at least $${this.data.total.toFixed(2)}`, '', { duration: 3000 });

      return;
    }
    this.dialogRef.close(amount);
  }
  triggerShake() {
    this.shake = true;
    setTimeout(() => this.shake = false, 600);
  }
  cancel() {
    this.dialogRef.close(null);
  }
}

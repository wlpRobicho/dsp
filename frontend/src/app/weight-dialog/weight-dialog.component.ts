import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-weight-dialog',
  templateUrl: './weight-dialog.component.html',
  styleUrls: ['./weight-dialog.component.css']
})
export class WeightDialogComponent {
  weightString: string = '';

  constructor(
    public dialogRef: MatDialogRef<WeightDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  addNumber(num: string) {
    if (num === '.' && this.weightString.includes('.')) {
      return; // prevent double decimal
    }
    this.weightString += num;
  }

  backspace() {
    this.weightString = this.weightString.slice(0, -1);
  }

  clear() {
    this.weightString = '';
  }

  confirm() {
    const weight = parseFloat(this.weightString);
    if (weight > 0) {
      this.dialogRef.close(weight);
    } else {
      // Optionally show error (or just do nothing)
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}

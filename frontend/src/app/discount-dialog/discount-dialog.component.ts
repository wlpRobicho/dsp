import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-discount-dialog',
  templateUrl: './discount-dialog.component.html',
  styleUrls: ['./discount-dialog.component.css']
})
export class DiscountDialogComponent {
  discountCode: string = '';
  error: string | null = null;
  shake = false;

  constructor(
    public dialogRef: MatDialogRef<DiscountDialogComponent>,
    private http: HttpClient
  ) {}

  addCharacter(char: string) {
    this.discountCode += char.toUpperCase(); // Force uppercase
    this.error = null;
  }

  backspace() {
    this.discountCode = this.discountCode.slice(0, -1);
    this.error = null;
  }

  clear() {
    this.discountCode = '';
    this.error = null;
  }

  confirm() {
    // No need for manual token/header — interceptor handles it
    this.http.get(`/api/sales/discounts/validate/?code=${this.discountCode.toUpperCase()}`).subscribe({
      next: () => {
        this.dialogRef.close(this.discountCode); // Close on success
      },
      error: () => {
        this.error = 'Invalid or expired discount code';
        this.triggerShake();
      }
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }

  triggerShake() {
    this.shake = true;
    setTimeout(() => this.shake = false, 600);
  }
}

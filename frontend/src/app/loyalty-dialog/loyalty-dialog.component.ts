import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loyalty-dialog',
  templateUrl: './loyalty-dialog.component.html',
  styleUrls: ['./loyalty-dialog.component.css']
})
export class LoyaltyDialogComponent implements AfterViewInit {
  phoneNumber: string = '';
  showError: boolean = false;

  @ViewChild('phoneInput') phoneInputRef!: ElementRef;

  constructor(private dialogRef: MatDialogRef<LoyaltyDialogComponent>) {}

  ngAfterViewInit() {
    setTimeout(() => this.phoneInputRef.nativeElement.focus(), 0);
  }

  appendDigit(digit: string) {
    if (this.phoneNumber.length < 10) {
      this.phoneNumber += digit;
      this.showError = false;
    }
  }

  backspace() {
    this.phoneNumber = this.phoneNumber.slice(0, -1);
  }

  clearPhone() {
    this.phoneNumber = '';
  }

  onConfirm() {
    if (this.phoneNumber.length === 10) {
      this.dialogRef.close(this.phoneNumber);
    } else {
      this.showError = true;
    }
  }
  
  onSkip() {
    this.dialogRef.close(null);
  }
}

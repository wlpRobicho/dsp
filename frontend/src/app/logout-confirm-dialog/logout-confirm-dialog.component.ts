import { Component } from '@angular/core';

@Component({
  selector: 'app-logout-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Logout</h2>
    <mat-dialog-content>Are you sure you want to logout?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      font-weight: bold;
    }
    mat-dialog-content {
      margin-top: 10px;
      margin-bottom: 20px;
    }
    mat-dialog-actions {
      margin-top: 10px;
    }
  `]
})
export class LogoutConfirmDialogComponent {}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.css']
})
export class ReceiptDialogComponent implements OnInit {
  isRefund: boolean = false; // Initialize with default value

  constructor(
    public dialogRef: MatDialogRef<ReceiptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      transactionId: number, 
      changeDue: string,
      total: any,
      isRefund?: boolean // Add isRefund to dialog data
    },
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Set initial value from dialog data
    if (this.data.isRefund !== undefined) {
      this.isRefund = this.data.isRefund;
    }
  }

  printReceipt() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token missing. Please log in again.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `http://localhost:8000/api/sales/receipt/${this.data.transactionId}/`;

    this.http.get(url, { 
      headers, 
      responseType: 'blob',
      params: { is_refund: this.isRefund.toString() } // Pass refund status to API
    }).subscribe(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `receipt_${this.data.transactionId}_${this.isRefund ? 'refund' : 'sale'}.pdf`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      this.dialogRef.close();
    }, error => {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt.');
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
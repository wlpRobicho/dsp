import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { WeightDialogComponent } from '../weight-dialog/weight-dialog.component';

@Component({
  selector: 'app-non-barcode-dialog',
  templateUrl: './non-barcode-dialog.component.html',
  styleUrls: ['./non-barcode-dialog.component.css']
})
export class NonBarcodeDialogComponent implements OnInit {
  nonBarcodeItems: any[] = [];

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<NonBarcodeDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // ✅ NO need to manually attach Authorization header — Interceptor handles it
    this.http.get<any[]>('http://localhost:8000/api/inventory/products/non-barcode/').subscribe({
      next: (data) => {
        this.nonBarcodeItems = data;
      },
      error: (err) => {
        console.error('Error fetching non-barcode items:', err);
      }
    });
  }

  selectItem(item: any) {
    if (item.price_by_weight) {
      const weightDialog = this.dialog.open(WeightDialogComponent, {
        width: '350px',
        height: '600px',
        data: { item }
      });

      weightDialog.afterClosed().subscribe(weight => {
        if (weight) {
          const itemWithWeight = {
            ...item,
            weight,
            quantity: weight,
            total: weight * item.price
          };
          this.dialogRef.close(itemWithWeight);
        }
      });
    } else {
      const normalItem = {
        ...item,
        quantity: 1,
        total: item.price
      };
      this.dialogRef.close(normalItem);
    }
  }
}

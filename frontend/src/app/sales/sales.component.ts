import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmDialogComponent } from '../logout-confirm-dialog/logout-confirm-dialog.component';
import { NonBarcodeDialogComponent } from '../non-barcode-dialog/non-barcode-dialog.component';
import { WeightDialogComponent } from '../weight-dialog/weight-dialog.component';
import { DiscountDialogComponent } from '../discount-dialog/discount-dialog.component';
import { LoyaltyDialogComponent } from '../loyalty-dialog/loyalty-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { ReceiptDialogComponent } from '../receipt-dialog/receipt-dialog.component';
import { CashAmountDialogComponent } from '../cash-amount-dialog/cash-amount-dialog.component';



@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  username = '';
  barcode = '';
  selectedItem: any = null;
  cartItems: any[] = [];
  subtotal = 0;
  total = 0;
  totalQuantity = 0;
  baseUrl = 'http://localhost:8000/api/inventory/products';
  scanSound = new Audio('assets/sounds/scan-beep.mp3');
  // Checkout states
  isRefund: boolean = false;
  discountCode: string | null = null;
  paymentMethod: 'cash' | 'card' | null = null;
  amountReceived: number | null = null;
  loyaltyPhone: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  playScanSound() {
    this.scanSound.currentTime = 0;
    this.scanSound.play().catch(err => {
      console.warn('Sound playback failed:', err);
    });
  }

  searchItem() {
    if (!this.barcode) return;

    this.http.get<any[]>(`${this.baseUrl}/?barcode=${this.barcode}`).subscribe({

      next: (items: any[]) => {
        const item = items[0];
        if (item) {
          const existingItem = this.cartItems.find(ci => ci.id === item.id);
          if (existingItem) {
            existingItem.quantity += 1;
            existingItem.total = existingItem.quantity * parseFloat(item.selling_price);
          } else {
            this.cartItems.push({
              ...item,
              quantity: 1,
              total: parseFloat(item.selling_price)
            });
          }
          this.updateCartTotals();
          this.playScanSound();
        }
        this.barcode = '';
      },
      error: (err) => {
        console.error('Error fetching barcode item:', err);
      }
    });
  }

  openNonBarcodeDialog() {
    const dialogRef = this.dialog.open(NonBarcodeDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      panelClass: 'non-barcode-dialog-panel'
    });

    dialogRef.afterClosed().subscribe((selectedItem) => {
      if (selectedItem) {
        const existingItem = this.cartItems.find(ci => ci.id === selectedItem.id);
        if (existingItem) {
          existingItem.quantity += selectedItem.quantity || 1;
          existingItem.total = existingItem.quantity * parseFloat(selectedItem.price);
        } else {
          this.cartItems.push({
            ...selectedItem,
            quantity: selectedItem.quantity || 1,
            total: parseFloat(selectedItem.price) * (selectedItem.quantity || 1)
          });
        }
        this.updateCartTotals();
      }
    });
  }

  openDiscountDialog() {
    if (this.discountCode) {
      this.snackBar.open('Discount already applied.', '', { duration: 2000 });
      return;
    }
  
    const dialogRef = this.dialog.open(DiscountDialogComponent, {
      width: '600px',
      height: '100vh',
      panelClass: 'discount-dialog-panel'
    });
  
    dialogRef.afterClosed().subscribe((discountCode) => {
      if (discountCode) {
        this.discountCode = discountCode;
        this.snackBar.open('Discount code applied', '', { duration: 3000 });
        this.updateCartTotals();
      }
    });
  }
  

  addItem(item: any) {
    item.quantity += 1;
    item.total = parseFloat(item.selling_price || item.price) * item.quantity;
    this.selectedItem = item;
    this.updateTotals();
    this.updateCustomerView();
  }

  subtractItem(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      item.total = parseFloat(item.selling_price || item.price) * item.quantity;
    } else {
      this.removeItem(item);
    }
    this.updateTotals();
    this.updateCustomerView();
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i.name !== item.name);
    this.updateTotals();
    this.updateCustomerView();
  }

  clearCart() {
    this.cartItems = [];
    this.updateTotals();
    this.updateCustomerView();
  }


  updateCartTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.total, 0);
    this.totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);  
    this.total = this.subtotal - this.discountAmount; 
    this.updateCustomerView();
  }

  updateTotals() {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + item.total, 0);

    // Apply 10% discount if a discount code is applied
    if (this.discountCode) {
        this.total = this.subtotal * 0.9;
    } else {
        this.total = this.subtotal;
    }

    this.totalQuantity = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
}

  get discountAmount(): number {
    return this.discountCode ? this.subtotal * 0.10 : 0;
  }

  updateCustomerView() {
    const cartData = {
      items: this.cartItems,
      total: this.total,
      discountApplied: !!this.discountCode,  // true if discount applied
    };
    localStorage.setItem('customer_cart', JSON.stringify(cartData));
  }

  clearDiscount() {
    this.discountCode = null;
    this.snackBar.open('Discount removed', '', { duration: 2000 });
    this.updateTotals(); // Recalculate total without discount
  }

  keypadLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', '←', 'Clear']
  ];

  pressKey(key: string) {
    if (key === 'Clear') {
      this.barcode = '';
    } else if (key === '←') {
      this.barcode = this.barcode.slice(0, -1);
    } else {
      this.barcode += key;
    }
  }

  toggleRefund() {
    this.isRefund = !this.isRefund;
  }

  buildSalesItems() {
    return this.cartItems.map(item => {
      return item.barcode
        ? { barcode: item.barcode, quantity: item.quantity }
        : { product_id: item.id, quantity: item.quantity };
    });
  }

  submitSale(paymentMethod: 'cash' | 'card', amountReceived: number) {
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.snackBar.open('No token found. Please log in again.', '', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    const payload = {
      payment_method: paymentMethod,
      amount_received: paymentMethod === 'cash' ? amountReceived.toString() : "0",
      discount_code: this.discountCode || "",
      phone_number: this.loyaltyPhone || "",
      is_refund: this.isRefund,
      items: this.buildSalesItems()
    };
  
    this.http.post('http://localhost:8000/api/sales/sales/', payload, { headers }).subscribe({
      next: (response) => {
        const res = response as any;
        const transactionId = res.transaction_id;
        const changeDue = res.change_due;
        const total =res.total_amount

   
        this.dialog.open(ReceiptDialogComponent, {
          width: '400px',
          height: '220px',
          data: { transactionId, changeDue,total,isRefund: this.isRefund }
        });
        localStorage.setItem('thank_you', 'true'); // Show thank you screen

        setTimeout(() => {
          localStorage.removeItem('thank_you'); // Remove after 3 seconds
          localStorage.setItem('customer_cart', JSON.stringify([])); // Clear customer cart
        }, 3000);
          
        this.clearCart();
        this.discountCode = null;
        this.loyaltyPhone = null;
        this.paymentMethod = null;
        this.amountReceived = null;
        this.isRefund = false;
      },
      // error: (error) => {
      //   console.error('Sale failed:', error);
      //   this.snackBar.open('Sale failed..', error.detail, { duration: 3000 });
      // }
      // error: (error) => {
      //   console.error('Sale failed:', error);
        
      //   let errorMessage = 'Sale failed';
        
      //   if (error.error?.detail) {
      //     errorMessage = error.error.detail;
      //   } else if (error.message) {
      //     errorMessage = error.message;
      //   }
        
      //   this.snackBar.open(errorMessage, 'Dismiss', { 
      //     duration: 5000, // Longer duration for more complex messages
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     panelClass: ['error-snackbar']
      //   });
      // }
      error: (error) => {
        const errorMessage = error.error?.detail || 
                           error.error?.message || 
                           error.message || 
                           'Sale failed';
        
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  
  
}

startCheckout() {
  const dialogRef = this.dialog.open(LoyaltyDialogComponent, {
    width: '400px',
    panelClass: 'loyalty-dialog'
  });

  dialogRef.afterClosed().subscribe((phone: string | null) => {
    if (phone) {
      this.loyaltyPhone = phone;
      console.log('Loyalty phone:', phone);
    } else {
      console.log('No loyalty number entered.');
    }

    // ✅ Open payment popup after loyalty
    this.openPaymentDialog();
  });
}

openPaymentDialog() {
  const dialogRef = this.dialog.open(PaymentDialogComponent, {
    width: '400px',
    height: '200px',
    panelClass: 'payment-dialog'
  });

  dialogRef.afterClosed().subscribe((payment: 'cash' | 'card' | null) => {
    if (payment === 'card') {
      this.paymentMethod = 'card';
      this.amountReceived = null;
      this.submitSale('card', null as any);      
    } else if (payment === 'cash') {
      this.paymentMethod = 'cash';
      if(this.isRefund){
        this.amountReceived=null
        this.submitSale("cash",0 )
      }
      // ✅ Now open another popup to enter cash amount
      else
      this.openCashAmountDialog();
    }
  });
}

openCashAmountDialog() {
  const dialogRef = this.dialog.open(CashAmountDialogComponent, {
    width: '400px',
    height: '500px',
    data: { total: this.total }
  });

  dialogRef.afterClosed().subscribe((amount: number | null) => {
    if (amount !== null) {
      this.amountReceived = amount;
      this.submitSale('cash', amount);
    }
  });
}



finalizeCheckout() {
  if (!this.paymentMethod) {
    console.error('Payment method not selected');
    return;
  }

  if (this.paymentMethod === 'cash') {
    this.amountReceived = this.total; // assume full cash received (later: popup to ask)
  } else {
    this.amountReceived = this.total; // card just uses total
  }

  this.submitSale(this.paymentMethod, this.amountReceived!);
}


logout() {
  const dialogRef = this.dialog.open(LogoutConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const userid = localStorage.getItem('userid');
      const password = localStorage.getItem('password');

      this.http.post('http://localhost:8000/api/users/logout/', { userid, password }).subscribe({
        next: () => {
          localStorage.clear();
          this.snackBar.open('Logged out successfully', '', {
            duration: 3000,
            panelClass: 'logout-snackbar'
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed:', err);
          alert('Logout failed, please try again.');
        }
      });
    }
  });
}


  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  currentTime: string = '';

  updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

    this.currentTime = `${hours}:${minutes}:${seconds} | ${dayName} ${day} ${month} ${year}`;
  }

  
}


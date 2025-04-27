import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SalesComponent } from './sales/sales.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LogoutConfirmDialogComponent } from './logout-confirm-dialog/logout-confirm-dialog.component';
import { NonBarcodeDialogComponent } from './non-barcode-dialog/non-barcode-dialog.component';
import { WeightDialogComponent } from './weight-dialog/weight-dialog.component';
import { DiscountDialogComponent } from './discount-dialog/discount-dialog.component'; // ✅
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoyaltyDialogComponent } from './loyalty-dialog/loyalty-dialog.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { CashAmountDialogComponent } from './cash-amount-dialog/cash-amount-dialog.component';
import { ReceiptDialogComponent } from './receipt-dialog/receipt-dialog.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SalesComponent,
    LogoutConfirmDialogComponent,
    NonBarcodeDialogComponent,
    WeightDialogComponent,
    DiscountDialogComponent,
    LoyaltyDialogComponent,
    PaymentDialogComponent,
    CashAmountDialogComponent,
    ReceiptDialogComponent,
    CustomerViewComponent,
    AnalyticsComponent // ✅ Only here in declarations
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    NgChartsModule
  ],
  
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
    ],

  bootstrap: [AppComponent]
})
export class AppModule { }

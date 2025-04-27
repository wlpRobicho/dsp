import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  total: number = 0;
  subscription: Subscription | undefined;
  showThankYou: boolean = false;
  showWelcome: boolean = true; // Start with welcome true
  private thankYouAlreadyShown = false;
  discountApplied: boolean = false;

  ngOnInit() {
    this.subscription = interval(500).subscribe(() => {
      this.loadCart();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCart() {
    const thankYou = localStorage.getItem('thank_you');

    if (thankYou === 'true' && !this.thankYouAlreadyShown) {
      this.showThankYou = true;
      this.showWelcome = false;
      this.cartItems = [];
      this.total = 0;
      this.discountApplied = false;
      this.thankYouAlreadyShown = true;

      setTimeout(() => {
        localStorage.removeItem('thank_you');
        this.showThankYou = false;
        this.showWelcome = true; // Go back to Welcome after Thank You
      }, 3000);

    } else if (!thankYou) {
      const cartData = localStorage.getItem('customer_cart');
      if (cartData) {
        const parsedData = JSON.parse(cartData);
        this.cartItems = parsedData.items || [];
        this.total = parsedData.total || 0;
        this.discountApplied = parsedData.discountApplied || false;
        this.thankYouAlreadyShown = false;

        // ✅ THIS CONTROLS WELCOME: If cart has items ➔ hide welcome
        if (this.cartItems.length > 0) {
          this.showWelcome = false;
        } else {
          this.showWelcome = true;
        }

      } else {
        this.cartItems = [];
        this.total = 0;
        this.discountApplied = false;
        this.showWelcome = true;
        this.thankYouAlreadyShown = false;
      }
    }
  }
}

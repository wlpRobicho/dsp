import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userIdValue = '';
  passwordValue: string = '';
  activeInput: 'userId' | 'password' = 'userId';
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar ) {}

  // Focus handlers
  focusUserId() {
    this.activeInput = 'userId';
  }

  focusPassword() {
    this.activeInput = 'password';
  }
  // Input manipulation
  appendToInput(value: string) {
    if (this.activeInput === 'userId' && this.userIdValue.length < 4) {
      this.userIdValue += value;
    } else if (this.activeInput === 'password' && this.passwordValue.length < 4) {
      this.passwordValue += value;
    }
  }
  clearInput() {
    if (this.activeInput === 'userId') {
      this.userIdValue = '';
    } else if (this.activeInput === 'password') {
      this.passwordValue = '';
    }
  }

  loginUser() {
    const loginData = {
        userid: this.userIdValue,
        password: this.passwordValue
    };

    this.http.post<any>('http://localhost:8000/api/users/token/', loginData).subscribe({
        next: (tokenResponse) => {
            const token = tokenResponse.access;
            const refresh = tokenResponse.refresh;

            if (!token) {
                this.showErrorPopup('No token received');
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('userid', this.userIdValue);
            localStorage.setItem('password', this.passwordValue);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

            this.http.post<any>('http://localhost:8000/api/users/login/', loginData, { headers }).subscribe({
                next: (loginResponse) => {
                    console.log('Login successful:', loginResponse);
                    this.snackBar.open('Login successful! Welcome 🎉', 'Close', {
                        duration: 3000,
                        panelClass: ['login-success-snackbar']
                    });
                    this.router.navigate(['/sales']);
                },
                error: (loginError) => {
                    console.error('Login error:', loginError);
                    this.snackBar.open('Wrong UserID or Password! Try again.', 'Close', {
                        duration: 3000,
                        panelClass: ['error-snackbar']
                    });
                }
            });
        },
        error: (tokenError) => {
            console.error('Token error:', tokenError);
            this.snackBar.open('Wrong UserID or Password! Try again.', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
        }
    });
}


showErrorPopup(message: string) {
    const snackbar = document.createElement('div');
    snackbar.className = 'error-snackbar';
    snackbar.innerText = message;

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.add('show');
    }, 10);

    setTimeout(() => {
        snackbar.classList.remove('show');
        setTimeout(() => {
            snackbar.remove();
        }, 300);
    }, 3000); 
}
}
// src/app/components/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
        <div class="login-container">
            <h2>Login</h2>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        formControlName="email" 
                        class="form-control"
                        [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                        placeholder="Enter your email">
                    <div class="error" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">
                        Email is required
                    </div>
                    <div class="error" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">
                        Please enter a valid email
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        formControlName="password" 
                        class="form-control"
                        [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                        placeholder="Enter your password">
                    <div class="error" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
                        Password is required
                    </div>
                </div>

                <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

                <button type="submit" [disabled]="loginForm.invalid || loading">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
                <p class="register-link">
                    Don't have an account? <a routerLink="/register">Register here</a>
                </p>
            </form>
        </div>
    `,
    styles: [`
        /* ... keep your existing styles ... */
        
        .is-invalid {
            border-color: #dc3545;
        }

        .alert {
            padding: 0.75rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }

        .alert-danger {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
    `]
})
export class LoginComponent {
    loginForm: FormGroup;
    error: string = '';
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.error = '';
            
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    this.router.navigate(['/todos']);
                },
                error: (err) => {
                    console.error('Login error:', err);
                    this.error = err.message || 'Login failed. Please check your credentials.';
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                }
            });
        }
    }
}
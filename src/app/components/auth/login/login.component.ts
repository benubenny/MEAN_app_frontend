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
                        placeholder="Enter your password">
                    <div class="error" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
                        Password is required
                    </div>
                </div>

                <div class="error-message" *ngIf="error">{{ error }}</div>

                <button type="submit" [disabled]="loginForm.invalid">Login</button>
                <p class="register-link">
                    Don't have an account? <a routerLink="/register">Register here</a>
                </p>
            </form>
        </div>
    `,
    styles: [`
        .login-container {
            max-width: 400px;
            margin: 2rem auto;
            padding: 2rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #666;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .form-control:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        button {
            width: 100%;
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        }

        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .error-message {
            color: #dc3545;
            text-align: center;
            margin: 1rem 0;
        }

        .register-link {
            text-align: center;
            margin-top: 1rem;
        }

        .register-link a {
            color: #007bff;
            text-decoration: none;
        }

        .register-link a:hover {
            text-decoration: underline;
        }
    `]
})
export class LoginComponent {
    loginForm: FormGroup;
    error: string = '';

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
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: () => {
                    this.router.navigate(['/todos']);
                },
                error: (err) => {
                    this.error = err.error.message || 'Login failed';
                }
            });
        }
    }
}
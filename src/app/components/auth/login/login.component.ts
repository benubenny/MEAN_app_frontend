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

                <div class="alert alert-danger" *ngIf="error">{{ error }}</div>

                <button type="submit" [disabled]="loginForm.invalid || loading" class="submit-btn">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
                
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
            background: white;
        }

        h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
            font-weight: 500;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
            font-weight: 500;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-control:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .submit-btn {
            width: 100%;
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            margin-top: 1rem;
            transition: background-color 0.2s;
        }

        .submit-btn:hover {
            background-color: #0056b3;
        }

        .submit-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .alert {
            padding: 0.75rem;
            margin: 1rem 0;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .alert-danger {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }

        .register-link {
            text-align: center;
            margin-top: 1.5rem;
            color: #666;
        }

        .register-link a {
            color: #007bff;
            text-decoration: none;
            font-weight: 500;
        }

        .register-link a:hover {
            text-decoration: underline;
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
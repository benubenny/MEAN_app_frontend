// src/app/components/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            class="form-control"
            placeholder="Enter your name">
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            class="form-control"
            placeholder="Enter your email">
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            formControlName="password" 
            class="form-control"
            placeholder="Enter your password">
        </div>

        <div class="error-message" *ngIf="error">{{ error }}</div>

        <button type="submit" [disabled]="registerForm.invalid">Register</button>
        <p class="login-link">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
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
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #0056b3;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      margin: 1rem 0;
    }

    .login-link {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    .login-link a {
      color: #007bff;
      text-decoration: none;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error.message || 'Registration failed';
        }
      });
    }
  }
}


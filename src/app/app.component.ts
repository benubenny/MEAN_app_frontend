// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  template: `
    <div class="app-container">
      <nav *ngIf="authService.isLoggedIn()" class="nav-bar">
        <div class="nav-brand">Todo App</div>
        <div class="nav-items">
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </nav>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
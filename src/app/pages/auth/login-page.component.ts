import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="login-icon">🔐</div>
            <h1>Welcome Back</h1>
            <p>Sign in to your Customer Manager account</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="Enter your email"
              >
              <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-control"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Enter your password"
              >
              <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
            </div>
            
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="rememberMe">
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-link">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              class="login-btn"
              [disabled]="loginForm.invalid"
              [class.loading]="isLoading"
            >
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="loading-spinner">🔄</span>
            </button>
          </form>
          
          <div class="demo-credentials">
            <h3>Demo Credentials</h3>
            <p><strong>Email:</strong> demo&#64;customermanager.com</p>
            <p><strong>Password:</strong> demo123</p>
            <button class="demo-btn" (click)="fillDemoCredentials()">Use Demo Login</button>
          </div>
          
          <div class="signup-link">
            <p>Don't have an account? <a href="#">Sign up here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 120px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    
    .login-container {
      width: 100%;
      max-width: 450px;
    }
    
    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      padding: 50px 40px;
      animation: slideUp 0.6s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .login-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }
    
    .login-header h1 {
      font-size: 2.2rem;
      color: #2c3e50;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .login-header p {
      color: #6c757d;
      font-size: 1rem;
    }
    
    .login-form {
      margin-bottom: 30px;
    }
    
    .form-group {
      margin-bottom: 25px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .form-control {
      width: 100%;
      padding: 15px 18px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
    
    .form-control.error {
      border-color: #dc3545;
      background: #fff5f5;
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 8px;
      padding-left: 5px;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.9rem;
      color: #6c757d;
    }
    
    .checkbox-label input[type="checkbox"] {
      margin-right: 8px;
      transform: scale(1.2);
      accent-color: #667eea;
    }
    
    .forgot-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .forgot-link:hover {
      text-decoration: underline;
    }
    
    .login-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 16px;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
    
    .login-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
    }
    
    .login-btn.loading {
      pointer-events: none;
    }
    
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .demo-credentials {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 25px;
      text-align: center;
    }
    
    .demo-credentials h3 {
      color: #2c3e50;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }
    
    .demo-credentials p {
      margin: 5px 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .demo-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      margin-top: 15px;
      transition: all 0.2s ease;
    }
    
    .demo-btn:hover {
      background: #218838;
      transform: translateY(-1px);
    }
    
    .signup-link {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }
    
    .signup-link p {
      color: #6c757d;
      margin: 0;
    }
    
    .signup-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .signup-link a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .login-page {
        padding: 20px 15px;
      }
      
      .login-card {
        padding: 30px 25px;
      }
      
      .login-header h1 {
        font-size: 1.8rem;
      }
      
      .form-options {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginPageComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Simulate login API call
      setTimeout(() => {
        console.log('Login attempt:', this.loginForm.value);
        this.isLoading = false;
        
        // For demo purposes, always redirect to customers page
        this.router.navigate(['/customers']);
      }, 2000);
    }
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'demo@customermanager.com',
      password: 'demo123'
    });
  }
}

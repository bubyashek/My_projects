import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RegisterData } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Регистрация</h1>
        
        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="registerData.username"
              required
              minlength="3"
              placeholder="Введите имя пользователя"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="registerData.email"
              required
              email
              placeholder="Введите email"
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="registerData.password"
              required
              minlength="6"
              placeholder="Введите пароль (мин. 6 символов)"
            />
          </div>

          @if (errorMessage) {
            <div class="error-message">{{ errorMessage }}</div>
          }

          <button type="submit" [disabled]="!registerForm.form.valid || isLoading">
            {{ isLoading ? 'Загрузка...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <div class="auth-link">
          <p>Уже есть аккаунт? <a (click)="goToLogin()">Войти</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      background: #ffffff;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 30px;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      color: #4a5568;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    input {
      width: 100%;
      padding: 12px 16px;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      color: #2d3748;
      font-size: 16px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      background: #ffffff;
    }

    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      color: #e53e3e;
      background: #fed7d7;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      border-left: 4px solid #e53e3e;
    }

    .auth-link {
      margin-top: 20px;
      text-align: center;
    }

    .auth-link p {
      color: #718096;
      font-size: 14px;
    }

    .auth-link a {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-link a:hover {
      text-decoration: underline;
      color: #5a67d8;
    }
  `]
})
export class RegisterComponent {
  registerData: RegisterData = {
    username: '',
    password: '',
    email: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onRegister(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.register(this.registerData).subscribe({
      next: (user) => {
        console.log('Registration successful:', user);
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.error || 'Ошибка регистрации. Попробуйте снова.';
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}


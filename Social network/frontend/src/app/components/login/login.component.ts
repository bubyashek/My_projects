import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Вход в социальную сеть</h1>
        
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Email</label>
            <input
              type="email"
              id="username"
              name="username"
              [(ngModel)]="credentials.username"
              required
              placeholder="Введите email"
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              placeholder="Введите пароль"
            />
          </div>

          @if (errorMessage) {
            <div class="error-message">{{ errorMessage }}</div>
          }

          <button type="submit" [disabled]="!loginForm.form.valid || isLoading">
            {{ isLoading ? 'Загрузка...' : 'Войти' }}
          </button>
        </form>

        <div class="auth-link">
          <p>Нет аккаунта? <a (click)="goToRegister()">Зарегистрироваться</a></p>
        </div>
        
        <div class="test-accounts">
          <p class="hint">Тестовые аккаунты (пароли в admin/data/users.json):</p>
          <ul>
            <li><strong>catmeow&#64;gmail.com</strong> (admin)</li>
            <li><strong>yuki.tanaka&#64;example.com</strong></li>
            <li><strong>gojo.satoru&#64;jujutsu.com</strong></li>
            <li><strong>pink.cat&#64;meow.com</strong></li>
            <li><strong>bubyashek&#64;loved.com</strong> (admin)</li>
          </ul>
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

    .test-accounts {
      margin-top: 24px;
      padding: 16px;
      background: #f7fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .test-accounts .hint {
      margin: 0 0 12px 0;
      color: #4a5568;
      font-size: 14px;
      font-weight: 600;
    }

    .test-accounts ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .test-accounts li {
      padding: 8px 0;
      color: #718096;
      font-size: 13px;
      font-family: 'Courier New', monospace;
    }

    .test-accounts strong {
      color: #2d3748;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.login(this.credentials).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.router.navigate(['/feed']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Неверное имя пользователя или пароль';
        this.isLoading = false;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}


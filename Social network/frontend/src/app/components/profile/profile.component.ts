import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">
          ← Назад
        </button>
        <h1>Редактировать профиль</h1>
        <div></div>
      </div>

      @if (currentUser) {
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar-large">
              @if (editForm.photo) {
                <img [src]="editForm.photo" alt="Avatar" class="avatar-img">
              } @else {
                {{ currentUser.username.charAt(0).toUpperCase() }}
              }
            </div>
          </div>

          <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
            <div class="form-group">
              <label for="firstName">Имя *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="editForm.firstName"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName">Фамилия *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="editForm.lastName"
                required
              />
            </div>

            <div class="form-group">
              <label for="middleName">Отчество</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                [(ngModel)]="editForm.middleName"
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="editForm.email"
                required
              />
            </div>

            <div class="form-group">
              <label for="dateOfBirth">Дата рождения</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                [(ngModel)]="editForm.dateOfBirth"
              />
            </div>

            <div class="form-group">
              <label for="photo">URL аватара</label>
              <input
                type="url"
                id="photo"
                name="photo"
                [(ngModel)]="editForm.photo"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="success-message">{{ successMessage }}</div>
            }

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="goBack()">
                Отмена
              </button>
              <button type="submit" class="btn-primary" [disabled]="!profileForm.form.valid || isLoading">
                {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: #f5f7fa;
      padding: 20px;
    }

    .header {
      max-width: 800px;
      margin: 0 auto 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }

    .btn-back {
      background: #e2e8f0;
      color: #2d3748;
      border: none;
      border-radius: 12px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-back:hover {
      transform: translateY(-2px);
      background: #cbd5e0;
    }

    .profile-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .avatar-section {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
    }

    .avatar-large {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      color: #2c3e50;
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
      font-size: 14px;
      font-family: inherit;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      background: #ffffff;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-primary:hover:not(:disabled), .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .btn-primary:disabled {
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

    .success-message {
      color: #38a169;
      background: #c6f6d5;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      border-left: 4px solid #38a169;
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  editForm: any = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    photo: '',
    dateOfBirth: ''
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.apiService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    console.log('👤 Current user from localStorage:', this.currentUser);

    // Load fresh user data from server to get all fields
    this.apiService.getUserById(this.currentUser.id).subscribe({
      next: (freshUser) => {
        console.log('✅ Fresh user data from server:', freshUser);
        this.currentUser = freshUser;
        
        // Initialize form with fresh data
        this.editForm = {
          firstName: freshUser.firstName || '',
          lastName: freshUser.lastName || '',
          middleName: freshUser.middleName || '',
          email: freshUser.email || '',
          photo: freshUser.photo || '',
          dateOfBirth: freshUser.dateOfBirth || ''
        };

        console.log('📝 Initialized edit form:', this.editForm);
      },
      error: (error) => {
        console.error('❌ Error loading user data:', error);
        // Fallback to cached data
        this.editForm = {
          firstName: this.currentUser!.firstName || '',
          lastName: this.currentUser!.lastName || '',
          middleName: this.currentUser!.middleName || '',
          email: this.currentUser!.email || '',
          photo: this.currentUser!.photo || '',
          dateOfBirth: this.currentUser!.dateOfBirth || ''
        };
      }
    });
  }

  saveProfile(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Only send changed fields (compare with original values, treating undefined and empty string as equal)
    const updates: any = {};
    
    if (this.editForm.firstName !== (this.currentUser.firstName || '')) {
      updates.firstName = this.editForm.firstName;
    }
    if (this.editForm.lastName !== (this.currentUser.lastName || '')) {
      updates.lastName = this.editForm.lastName;
    }
    if (this.editForm.middleName !== (this.currentUser.middleName || '')) {
      updates.middleName = this.editForm.middleName || '';
    }
    if (this.editForm.email !== (this.currentUser.email || '')) {
      updates.email = this.editForm.email;
    }
    if (this.editForm.photo !== (this.currentUser.photo || '')) {
      updates.photo = this.editForm.photo || '';
    }
    if (this.editForm.dateOfBirth !== (this.currentUser.dateOfBirth || '')) {
      updates.dateOfBirth = this.editForm.dateOfBirth || '';
    }

    console.log('📝 Profile updates to send:', updates);

    this.apiService.updateUser(this.currentUser.id, updates).subscribe({
      next: (user) => {
        console.log('✅ Profile updated:', user);
        this.currentUser = user;
        this.successMessage = 'Профиль успешно обновлён!';
        this.isLoading = false;
        
        // Redirect to feed after a short delay
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Error updating profile:', error);
        this.errorMessage = 'Ошибка при обновлении профиля. Попробуйте снова.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}


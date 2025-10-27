import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-post-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">
          ← Назад
        </button>
        <h1>Создать пост</h1>
        <div></div>
      </div>

      <div class="post-form-card">
        <form (ngSubmit)="createPost()" #postForm="ngForm">
          <div class="form-group">
            <label for="title">Заголовок *</label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="postTitle"
              required
              placeholder="Введите заголовок поста"
            />
          </div>

          <div class="form-group">
            <label for="content">Содержание *</label>
            <textarea
              id="content"
              name="content"
              [(ngModel)]="postContent"
              required
              rows="8"
              placeholder="Поделитесь своими мыслями..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="imageUrl">URL изображения (необязательно)</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              [(ngModel)]="imageUrl"
              placeholder="https://example.com/image.jpg"
            />
            @if (imageUrl) {
              <div class="image-preview">
                <img [src]="imageUrl" alt="Preview" (error)="onImageError()">
              </div>
            }
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
            <button type="submit" class="btn-primary" [disabled]="!postForm.form.valid || isLoading">
              {{ isLoading ? 'Публикация...' : 'Опубликовать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-post-container {
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

    .post-form-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      color: #2c3e50;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 600;
    }

    input[type="text"],
    input[type="url"] {
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

    input[type="text"]:focus,
    input[type="url"]:focus {
      outline: none;
      border-color: #667eea;
      background: #ffffff;
    }

    textarea {
      width: 100%;
      padding: 16px;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      color: #2d3748;
      font-size: 16px;
      font-family: inherit;
      resize: vertical;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
      border-color: #667eea;
      background: #ffffff;
    }

    .image-preview {
      margin-top: 16px;
      border-radius: 12px;
      overflow: hidden;
      max-width: 100%;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      max-height: 400px;
      object-fit: contain;
      display: block;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
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
export class AddPostComponent implements OnInit {
  currentUser: User | null = null;
  postTitle = '';
  postContent = '';
  imageUrl = '';
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
    }
  }

  createPost(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Combine title and content for backend
    const fullContent = `${this.postTitle}\n${this.postContent}`;

    this.apiService.createPost(this.currentUser.id, fullContent, this.imageUrl || undefined).subscribe({
      next: (post) => {
        console.log('Post created:', post);
        this.successMessage = 'Пост успешно опубликован!';
        this.isLoading = false;
        
        // Redirect to feed after a short delay
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.errorMessage = 'Ошибка при создании поста. Попробуйте снова.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }

  onImageError(): void {
    this.imageUrl = '';
    this.errorMessage = 'Не удалось загрузить изображение. Проверьте URL.';
  }
}


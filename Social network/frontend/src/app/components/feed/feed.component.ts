import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';
import { User, Post } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `
    <div class="feed-container">
      <header class="header">
        <div class="header-content">
          <h1>Социальная сеть</h1>
          <div class="header-actions">
            @if (currentUser) {
              <span class="username">{{ currentUser.username }}</span>
              @if (currentUser.isAdmin) {
                <button class="btn-secondary" (click)="goToAdmin()">
                  Админ панель
                </button>
              }
              <button class="btn-primary" (click)="goToAddPost()">
                + Добавить пост
              </button>
              <button class="btn-secondary" (click)="goToFriends()">
                Друзья
              </button>
              <button class="btn-secondary" (click)="goToProfile()">
                Профиль
              </button>
              <button class="btn-logout" (click)="logout()">
                Выйти
              </button>
            }
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="feed-header">
          <h2>Лента новостей</h2>
          <button class="btn-refresh" (click)="loadFeed()">
            Обновить
          </button>
        </div>

        @if (isLoading) {
          <div class="loading">Загрузка...</div>
        } @else if (posts.length === 0) {
          <div class="empty-state">
            <p>Пока нет постов</p>
            <button class="btn-primary" (click)="goToAddPost()">
              Создать первый пост
            </button>
          </div>
        } @else {
          <div class="posts-list">
            @for (post of posts; track post.id) {
              <div class="post-card">
                <div class="post-header">
                  <div class="post-author">
                    <div class="avatar">
                      @if (getUserById(post.userId)?.photo) {
                        <img [src]="getUserById(post.userId)?.photo" alt="Avatar" class="avatar-img">
                      } @else {
                        {{ getUserById(post.userId)?.username?.charAt(0)?.toUpperCase() || '?' }}
                      }
                    </div>
                    <div class="author-info">
                      <h3>{{ getUserById(post.userId)?.username || 'Unknown' }}</h3>
                      <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                    </div>
                  </div>
                  @if (currentUser && post.userId === currentUser.id) {
                    <button class="btn-delete" (click)="confirmDeletePost(post.id)">
                      Удалить
                    </button>
                  }
                </div>
                <div class="post-content">
                  {{ post.content }}
                </div>
                @if (post.image) {
                  <div class="post-image">
                    <img [src]="post.image" alt="Post image" (error)="onImageError($event)">
                  </div>
                }
              </div>
            }
          </div>
        }
      </main>

      <!-- Модальное окно подтверждения удаления -->
      <app-confirm-dialog
        [isOpen]="showDeleteConfirm"
        [title]="'Удаление поста'"
        [message]="'Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить.'"
        [confirmText]="'Удалить'"
        [cancelText]="'Отмена'"
        (confirmed)="onDeleteConfirmed()"
        (cancelled)="onDeleteCancelled()"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .feed-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .header {
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      padding: 20px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .username {
      color: #4a5568;
      font-size: 14px;
      padding: 0 10px;
      font-weight: 600;
    }

    .btn-primary, .btn-secondary, .btn-logout, .btn-refresh, .btn-delete {
      padding: 10px 20px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
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

    .btn-logout {
      background: #fc8181;
      color: white;
    }

    .btn-refresh {
      background: #4299e1;
      color: white;
    }

    .btn-delete {
      background: transparent;
      color: #e53e3e;
      padding: 6px 12px;
      font-size: 12px;
    }

    .btn-primary:hover, .btn-secondary:hover, .btn-logout:hover, .btn-refresh:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .main-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .feed-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .feed-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }

    .loading {
      text-align: center;
      color: #718096;
      padding: 40px;
      font-size: 18px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .empty-state p {
      color: #718096;
      font-size: 18px;
      margin-bottom: 20px;
    }

    .posts-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .post-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      animation: fadeIn 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .post-author {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      font-weight: 600;
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .author-info h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 16px;
      font-weight: 600;
    }

    .post-date {
      color: #718096;
      font-size: 12px;
    }

    .post-content {
      color: #2d3748;
      font-size: 16px;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .post-image {
      margin-top: 16px;
      border-radius: 12px;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      max-height: 500px;
      object-fit: cover;
      display: block;
    }
  `]
})
export class FeedComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  posts: Post[] = [];
  users: User[] = [];
  isLoading = false;
  showDeleteConfirm = false;
  postToDelete: number | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.apiService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUsers();
    this.loadFeed();
    this.setupSocketListeners();
    
    // Notify that user is online
    this.socketService.emitUserOnline(this.currentUser.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadFeed(): void {
    if (!this.currentUser) return;
    
    this.isLoading = true;
    this.apiService.getFeed(this.currentUser.id).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feed:', error);
        this.isLoading = false;
      }
    });
  }

  setupSocketListeners(): void {
    // Listen for new posts
    const newPostSub = this.socketService.onNewPost().subscribe({
      next: (post) => {
        console.log('📥 New post received via socket:', post);
        // Check if this post should be in the feed (from friend or self)
        if (!this.currentUser) return;
        
        const isSelfPost = post.userId === this.currentUser.id;
        const isFriendPost = this.currentUser.friends?.includes(post.userId);
        
        if (isSelfPost || isFriendPost) {
          // Add to feed if not already there
          if (!this.posts.find(p => p.id === post.id)) {
            this.posts = [post, ...this.posts];
          }
        }
      }
    });
    
    // Listen for deleted posts
    const deletedPostSub = this.socketService.onPostDeleted().subscribe({
      next: (postId) => {
        console.log('🗑️  Post deleted via socket:', postId);
        // Remove from feed
        this.posts = this.posts.filter(p => p.id !== postId);
      }
    });
    
    this.subscriptions.push(newPostSub, deletedPostSub);
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    if (days < 7) return `${days} д. назад`;
    
    return date.toLocaleDateString('ru-RU');
  }

  confirmDeletePost(postId: number): void {
    this.postToDelete = postId;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirmed(): void {
    if (this.postToDelete === null) return;

    this.apiService.deletePost(this.postToDelete).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== this.postToDelete);
        this.postToDelete = null;
        this.showDeleteConfirm = false; // Close dialog
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        this.postToDelete = null;
        this.showDeleteConfirm = false; // Close dialog even on error
      }
    });
  }

  onDeleteCancelled(): void {
    this.postToDelete = null;
    this.showDeleteConfirm = false; // Close dialog
  }

  goToAddPost(): void {
    this.router.navigate(['/add-post']);
  }

  goToFriends(): void {
    this.router.navigate(['/friends']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToAdmin(): void {
    // Open admin module in new tab
    window.open(environment.adminUrl, '_blank');
  }

  onImageError(event: any): void {
    // Hide broken images
    event.target.style.display = 'none';
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  template: `
    <div class="friends-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">
          ← Назад
        </button>
        <h1>Управление друзьями</h1>
        <div></div>
      </div>

      <div class="content">
        <div class="section">
          <h2>Мои друзья</h2>
          @if (friends.length === 0) {
            <div class="empty-state">
              <p>У вас пока нет друзей</p>
            </div>
          } @else {
            <div class="users-grid">
              @for (friend of friends; track friend.id) {
                <div class="user-card">
                  <div class="user-avatar">
                    @if (friend.photo) {
                      <img [src]="friend.photo" alt="Avatar" class="avatar-img">
                    } @else {
                      {{ friend.username.charAt(0).toUpperCase() }}
                    }
                  </div>
                  <div class="user-info">
                    <h3>{{ friend.username }}</h3>
                    <p>{{ friend.email }}</p>
                  </div>
                  <button class="btn-remove" (click)="confirmRemoveFriend(friend)">
                    Удалить
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <div class="section">
          <h2>Все пользователи</h2>
          @if (availableUsers.length === 0) {
            <div class="empty-state">
              <p>Нет доступных пользователей</p>
            </div>
          } @else {
            <div class="users-grid">
              @for (user of availableUsers; track user.id) {
                <div class="user-card">
                  <div class="user-avatar">
                    @if (user.photo) {
                      <img [src]="user.photo" alt="Avatar" class="avatar-img">
                    } @else {
                      {{ user.username.charAt(0).toUpperCase() }}
                    }
                  </div>
                  <div class="user-info">
                    <h3>{{ user.username }}</h3>
                    <p>{{ user.email }}</p>
                  </div>
                  <button class="btn-add" (click)="addFriend(user.id)">
                    Добавить
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Модальное окно подтверждения удаления друга -->
      <app-confirm-dialog
        [isOpen]="showRemoveConfirm"
        [title]="'Удаление из друзей'"
        [message]="'Вы уверены, что хотите удалить ' + friendToRemove?.username + ' из друзей?'"
        [confirmText]="'Удалить'"
        [cancelText]="'Отмена'"
        (confirmed)="onRemoveConfirmed()"
        (cancelled)="onRemoveCancelled()"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [`
    .friends-container {
      min-height: 100vh;
      background: #f5f7fa;
      padding: 20px;
    }

    .header {
      max-width: 1200px;
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

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section {
      margin-bottom: 40px;
    }

    .section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 700;
    }

    .empty-state {
      background: #ffffff;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }

    .empty-state p {
      color: #718096;
      font-size: 16px;
      margin: 0;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .user-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .user-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 600;
      flex-shrink: 0;
      overflow: hidden;
    }

    .user-avatar .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-info h3 {
      margin: 0 0 4px 0;
      color: #2c3e50;
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-info p {
      margin: 0;
      color: #718096;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .btn-add, .btn-remove {
      padding: 8px 16px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .btn-add {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-remove {
      background: #fc8181;
      color: white;
    }

    .btn-add:hover, .btn-remove:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class FriendsComponent implements OnInit {
  currentUser: User | null = null;
  allUsers: User[] = [];
  friends: User[] = [];
  availableUsers: User[] = [];
  showRemoveConfirm = false;
  friendToRemove: User | null = null;

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

    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        this.updateFriendsLists();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  updateFriendsLists(): void {
    if (!this.currentUser) return;

    // Reload current user to get updated friends list
    this.apiService.getUserById(this.currentUser.id).subscribe({
      next: (user) => {
        this.currentUser = user;
        
        // Update friends list
        this.friends = this.allUsers.filter(u => 
          this.currentUser?.friends.includes(u.id)
        );

        // Update available users (exclude self and current friends)
        this.availableUsers = this.allUsers.filter(u => 
          u.id !== this.currentUser?.id && 
          !this.currentUser?.friends.includes(u.id)
        );
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  addFriend(friendId: number): void {
    if (!this.currentUser) return;

    this.apiService.addFriend(this.currentUser.id, friendId).subscribe({
      next: () => {
        this.updateFriendsLists();
      },
      error: (error) => {
        console.error('Error adding friend:', error);
      }
    });
  }

  confirmRemoveFriend(friend: User): void {
    this.friendToRemove = friend;
    this.showRemoveConfirm = true;
  }

  onRemoveConfirmed(): void {
    if (!this.currentUser || !this.friendToRemove) return;

    this.apiService.removeFriend(this.currentUser.id, this.friendToRemove.id).subscribe({
      next: () => {
        this.updateFriendsLists();
        this.friendToRemove = null;
      },
      error: (error) => {
        console.error('Error removing friend:', error);
        this.friendToRemove = null;
      }
    });
  }

  onRemoveCancelled(): void {
    this.friendToRemove = null;
  }

  goBack(): void {
    this.router.navigate(['/feed']);
  }
}


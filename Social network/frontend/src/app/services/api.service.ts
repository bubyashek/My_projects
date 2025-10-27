import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, Post } from '../models/user.model';
import { environment } from '../../environments/environment';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Subject для новых постов
  private newPostSubject = new BehaviorSubject<Post | null>(null);
  public newPost$ = this.newPostSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService // Добавляем в конструктор
  ) {
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user);
      // Устанавливаем слушатели сокета
      this.setupSocketListeners();
      // Уведомляем сервер о том, что пользователь онлайн
      this.socketService.emitUserOnline(user.id);
    }
  }

  // ========== SOCKET LISTENERS ==========

  private setupSocketListeners(): void {
    // Слушаем новые посты от других пользователей
    this.socketService.onNewPost().subscribe((post: Post) => {
      this.newPostSubject.next(post);
    });

    // Можно добавить слушатель для статусов пользователей если нужно
    this.socketService.onUserStatusChanged().subscribe((data: any) => {
      console.log('User status changed:', data);
      // Здесь можно обновить статус пользователя в интерфейсе
    });
  }

  // ========== USER METHODS ==========

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          // Устанавливаем слушатели после логина
          this.setupSocketListeners();
          // Уведомляем сервер о том, что пользователь онлайн
          this.socketService.emitUserOnline(user.id);
        })
      );
  }

  register(data: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          // Устанавливаем слушатели после регистрации
          this.setupSocketListeners();
          // Уведомляем сервер о том, что пользователь онлайн
          this.socketService.emitUserOnline(user.id);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // Отключаем сокет при выходе
    this.socketService.disconnect();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(userId: number, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, updates)
      .pipe(
        tap(user => {
          // Update current user if it's the same user
          const currentUser = this.currentUserSubject.value;
          if (currentUser && currentUser.id === userId) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  updateUserPhoto(userId: number, photo: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/photo`, { photo });
  }

  addFriend(userId: number, friendId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/${userId}/friends`, { friendId });
  }

  removeFriend(userId: number, friendId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/users/${userId}/friends/${friendId}`);
  }

  // ========== POST METHODS ==========

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  getFeed(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/feed/${userId}`);
  }

  createPost(userId: number, content: string, image?: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, { 
      userId, 
      content, 
      image 
    });

  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`);
    // Сервер сам отправит событие удаления если нужно
  }

}
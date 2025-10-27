import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Post } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl);
  }

  onNewPost(): Observable<Post> {
    return new Observable(observer => {
      this.socket.on('newPost', (post: Post) => {
        console.log('🔔 Socket: New post received', post);
        observer.next(post);
      });
    });
  }

  onPostDeleted(): Observable<number> {
    return new Observable(observer => {
      this.socket.on('postDeleted', (postId: number) => {
        console.log('🔔 Socket: Post deleted', postId);
        observer.next(postId);
      });
    });
  }

  onUserStatusChanged(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userStatusChanged', (data: any) => {
        observer.next(data);
      });
    });
  }

  emitUserOnline(userId: number): void {
    this.socket.emit('userOnline', userId);
    console.log('📤 Socket: Emitted userOnline', userId);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}


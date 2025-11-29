import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3003';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onTradingUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('trading-update', callback);
    }
  }

  onPriceUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('price-update', callback);
    }
  }

  offTradingUpdate() {
    if (this.socket) {
      this.socket.off('trading-update');
    }
  }

  offPriceUpdate() {
    if (this.socket) {
      this.socket.off('price-update');
    }
  }
}

export const socketService = new SocketService();



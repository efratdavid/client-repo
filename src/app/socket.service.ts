import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    // Replace 'http://your-socket-io-server-url' with your Socket.io server URL
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('Socket.io connection established');
    });
  }

  // Define Socket.io event listeners here
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Emit Socket.io events here
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}


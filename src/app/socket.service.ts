import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Initialize Socket.IO client with pingTimeout and pingInterval
    this.socket = io('https://moveo-task-server.adaptable.app/', {
      transports: ['websocket'],
      pingTimeout: 120000, // 2 minutes
      pingInterval: 5000  // 5 seconds
    }as any);

    this.socket.on('connect', () => {
      console.log('Socket.io connection established');
    });
  }

  // Define Socket.io event listeners 
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Emit Socket.io events 
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}


import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io('https://moveo-task-server.adaptable.app/', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('Socket.io connection established');

      // Start sending keep-alive messages every 30 seconds 
      setInterval(() => {
        this.socket.emit('keep-alive');
      }, 10000);
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


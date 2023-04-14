import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { Message } from "../models/WsMess";

import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WsService {

  constructor() {
  }

  // private reconnectionAttempts = 5;
  // public currentAttempt = 0;
  // private socket$: WebSocketSubject<Message>;

  public connection(){
    return webSocket<Message>(`${environment.webSocketUrl}/ws/connect/client`)
  }
  
  // private connection(): void {
  //   this.socket$ = webSocket<Message>(`${environment.webSocketUrl}/ws/connect/client`)

  //   this.socket$.subscribe(
  //     () => {
  //       console.log('WebSocket connected');
  //       this.currentAttempt = 0;
  //     },
  //     (error) => {
  //       console.log(`WebSocket error: ${error}`);
  //       this.tryReconnect();
  //     },
  //     () => {
  //       console.log('WebSocket disconnected');
  //       this.tryReconnect();
  //     }
  //   );
  // }

  // public tryReconnect(): void {
  //   if (this.currentAttempt < this.reconnectionAttempts) {
  //     this.currentAttempt++;
  //     console.log(`WebSocket reconnecting (attempt ${this.currentAttempt})...`);
  //     setTimeout(() => {
  //       console.log('Trying...')
  //       this.connection();
  //     }, 5000); // Wait for 5 seconds before attempting to reconnect
  //   } else {
  //     console.log('WebSocket reconnection failed');
  //   }
  // }

  // public onMessage(): Observable<any> {
  //   return this.socket$.asObservable();
  // }
}

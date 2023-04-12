import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Message } from "../models/WsMess";

import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// import { Client } from '@stomp/stompjs';
// import * as Stomp from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<Message>;

  constructor() {
  }

  public connection(){
    return webSocket<Message>(`${environment.webSocketUrl}/ws/connect/client`)
  }

  public start() {
    this.messages = <Subject<Message>>this.connect(`${environment.webSocketUrl}/ws/connect/client`).pipe(
      map(
        (res: MessageEvent): Message => {
          let data = JSON.parse(res.data);
          console.log(data)
          return data;
        }
      )
    );
  }

  private connect(url): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Connected: " + url);
    }
    return this.subject;
  }

  private create(url): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('Message sent: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}

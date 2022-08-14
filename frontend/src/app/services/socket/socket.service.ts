import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Socket {
  socket: any;
  constructor(
    private http: HttpClient
  ) { }
  connect() {
    this.http.get('http://localhost:5001', {
      withCredentials: true
    }).subscribe(
      (data) => { },
      (err) => {
        if (err.status === 440 || err.status === 404) {
          window.location.reload()
        }
      })
    this.socket = io(`http://localhost:5001/`, {
      withCredentials: true
    });
  }
  listen(eventName: string) {
    return new Observable((Subscriber: any) => {
      this.socket?.on(eventName, (data: any) => {
        Subscriber.next(data)
      })
    })
  }
  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }
}

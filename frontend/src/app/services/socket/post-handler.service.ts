import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Socket } from './socket.service';
import { StateVariablesService } from './state-variables.service';

@Injectable({
  providedIn: 'root'
})
export class PostHandler {

  constructor(
    private Socket: Socket,
    private State: StateVariablesService
  ) { }

  GET_posts() {
    this.Socket.emit('GET_posts_request', {});
    this.Socket.listen('GET_posts_response').subscribe((data: any) => {
      this.State.posts.next(data);
    });
  }

  POST_create_post(data: any) {
    this.Socket.emit('POST_create_post_request', data)
    return this.Socket.listen('POST_create_post_response').pipe(map((data: any) => {
      return data
    }))
  }
}

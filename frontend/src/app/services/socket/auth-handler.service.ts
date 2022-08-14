import { Injectable } from '@angular/core';
import { Socket } from './socket.service';
import { StateVariablesService } from './state-variables.service';
import { UserHandlerService } from './user-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHandler {

  constructor(
    private Socket: Socket,
    private state: StateVariablesService,
    private UserHandler: UserHandlerService
  ) { }

  GET_auth_status() {
    this.Socket.emit('GET_auth_status_request', {});
    this.Socket.listen('GET_auth_status_response').subscribe((data: any) => {
      if (this.state.auth_state_sub.value === false) {
        this.state.auth_state_sub.next(data.auth_status);
      }
      if (data.auth_status === true) {
        this.UserHandler.GET_user_profile();
      }
    })
  }
  POST_login_request(data: any) {
    this.Socket.emit('POST_login_request', { username: data.username, password: data.password });
    this.Socket.listen('POST_login_response').subscribe((data: any) => {
      if (data.status === 200) {
        window.location.assign('/')
      }
    })
  }
}

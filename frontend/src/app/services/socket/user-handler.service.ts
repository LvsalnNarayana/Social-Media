import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MessageHandlerService } from './message-handler.service';
import { Socket } from './socket.service';
import { StateVariablesService } from './state-variables.service';

@Injectable({
  providedIn: 'root'
})
export class UserHandlerService {

  constructor(
    private Socket: Socket,
    private state: StateVariablesService,
    private MessageHandler: MessageHandlerService
  ) { }

  GET_user_profile() {
    this.Socket.emit('GET_profile_request', {});
    this.Socket.listen('GET_user_profile_response').pipe(map((data: any) => {
      return { ...data.user, connected_user: data.connected_user }
    })).subscribe((data: any) => {
      if (this.state.user.value === null) {
        this.MessageHandler.GET_messages(data.id)
        this.state.user.next(data)
      }
    })
  }
  GET_search_user(data: any) {
    this.Socket.emit('GET_search_user_request', data);
    this.Socket.listen('GET_search_user_response').subscribe((data: any) => {
      this.state.search_users.next(data);
    })
  };
  GET_search_user_profile(data: any) {
    this.Socket.emit('GET_search_user_profile_request', data);
    this.Socket.listen('GET_search_user_profile_response').pipe(map((data: any) => {
      return { ...data.user, connected_user: data.connected_user }
    })).subscribe((data: any) => {
      this.state.search_user_profile.next(data)
    })
  }
  GET_friend_invitations() {
    this.Socket.emit('GET_friend_invitations_request', {});
    this.Socket.listen('GET_friend_invitations_response').subscribe((data: any) => {
      this.state.friend_invitations.next(data)
    })
  }
  POST_invitation(receiver_id: any, username: any) {
    this.Socket.emit('POST_invitation_request', { receiver_id, username });
    this.Socket.listen('POST_invitation_response').subscribe((data: any) => {
      console.log(data);
    });
  }
  POST_accept_invitation(sender_id: any) {
    this.Socket.emit('POST_accept_invitation_request', sender_id);
  }
  POST_reject_invitation(sender_id: any) {
    this.Socket.emit('POST_reject_invitation_request', sender_id);
  }
  GET_active_friends() {
    this.Socket.emit('GET_active_friends_request', {});
    this.Socket.listen('GET_active_friends_response').subscribe((data: any) => {
      this.state.active_friends.next(data)
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateVariablesService {
  constructor() { }
  auth_state_sub = new BehaviorSubject(false);

  get auth_state() {
    return this.auth_state_sub.asObservable();
  }

  user = new BehaviorSubject(null);

  get username() {
    return this.user.pipe(
      map((data: any) => {
        return data !== null ? data.username : null;
      })
    );
  }

  search_users = new BehaviorSubject([]);

  search_user_profile: any = new BehaviorSubject(null);

  friend_invitations = new BehaviorSubject(null);

  posts = new BehaviorSubject(null);

  active_friends: any = new BehaviorSubject(null);

  active_conversations: any = new BehaviorSubject([]);

  user_messages: any = new BehaviorSubject(null)

  add_conversation(conversation: any) {
    const check_conversation = this.active_conversations.value.find((data: any) => {
      return data.id === conversation.id
    });
    if (check_conversation === null || check_conversation === undefined) {
      this.active_conversations.next([...this.active_conversations.value, conversation])
    }
  }
  close_conversation(conversation: any) {
    const check_conversation = this.active_conversations.value.find((data: any) => {
      return data.id === conversation.id
    });
    if (check_conversation !== null || check_conversation !== undefined) {
      const updated_conversation = this.active_conversations.value.filter((data: any) => {
        return data.id !== conversation.id
      })
      this.active_conversations.next([...updated_conversation])
    }
  }
}

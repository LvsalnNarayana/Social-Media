import { Injectable } from '@angular/core';
import { Socket } from './socket.service';
import { StateVariablesService } from './state-variables.service';
const mike = {
  receiver_id: '62974246d1246ef05f741705',
  sender_id: '62a316ad244a254358420df9',
  message: "hello",
}
const tom = {
  sender_id: '62974246d1246ef05f741705',
  receiver_id: '62a316ad244a254358420df9',
  message: "hi",
}
@Injectable({
  providedIn: 'root'
})
export class MessageHandlerService {

  constructor(
    private Socket: Socket,
    private State: StateVariablesService
  ) { }
  GET_messages(receiver_id: any) {
    this.Socket.emit('GET_messages_request', receiver_id);
    this.Socket.listen('GET_messages_response').subscribe((data: any) => {
      this.State.user_messages.next(data)
    })
  }

  POST_send_message(data: any) {
    const message_data = {
      receiver_id: data.receiver_id,
      message: data.message,
    }
    this.Socket.emit('POST_send_message_request', message_data);
    this.Socket.listen('POST_send_message_response').subscribe((data: any) => {
      console.log(data);
    })
  }

  GET_user_messages(user_id: any) {
    this.Socket.emit('GET_user_messages_request', user_id);
  }
}

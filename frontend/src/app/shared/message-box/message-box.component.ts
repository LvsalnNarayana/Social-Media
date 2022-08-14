import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageHandlerService } from 'src/app/services/socket/message-handler.service';
import { Socket } from 'src/app/services/socket/socket.service';
import { StateVariablesService } from 'src/app/services/socket/state-variables.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css'],
  inputs: ['userdata']
})
export class MessageBoxComponent implements OnInit {
  userdata: any;
  messages: any = [];
  message_input_form!: FormGroup;
  user: any;
  conversation_minimize = false;
  online = false;
  constructor(
    private MessageHandler: MessageHandlerService,
    private Socket: Socket,
    private State: StateVariablesService
  ) { }

  ngOnInit(): void {
    const index = this.State.active_friends.value.find((friend: any) => {
      if (friend.id === this.userdata.id) {
        return true
      }
      return false
    });
    if (index !== undefined) {
      this.online = true;
    } else {
      this.online = false;
    }
    this.message_input_form = new FormGroup({
      'message_input': new FormControl(null)
    });
    this.user = this.State.user?.value;
    this.MessageHandler.GET_user_messages(this.userdata.id);
    this.Socket.listen('GET_user_messages_response').subscribe((data: any) => {
      if (data?.users.includes(this.userdata.id) && data?.users.includes(this.user.id)) {
        this.messages = data?.messages;
      }
    });
  }
  send_message(receiver_id: any) {
    const message_data = {
      receiver_id: receiver_id,
      message: this.message_input_form.get('message_input')?.value,
    }
    this.MessageHandler.POST_send_message(message_data);
    this.message_input_form.setValue({
      'message_input': null
    })
  }
  close_conversation(user: any) {
    this.State.close_conversation(user)
  }
  minimize_conversation() {
    this.conversation_minimize = !this.conversation_minimize;
  }
}



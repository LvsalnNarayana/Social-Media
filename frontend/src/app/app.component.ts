import { Component, ViewChild, ElementRef } from '@angular/core';
import { Socket } from './services/socket/socket.service';
import { AuthHandler } from './services/socket/auth-handler.service';
import { StateVariablesService } from './services/socket/state-variables.service';
import { UserHandlerService } from './services/socket/user-handler.service';
import { MessageHandlerService } from './services/socket/message-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private Socket: Socket,
    private AuthHandler: AuthHandler,
    public State: StateVariablesService,
    private UserHandler: UserHandlerService,
    private MessageHandler: MessageHandlerService,

  ) { }
  @ViewChild('message_placement') message_placement!: ElementRef
  auth_state = false;
  active_conversations: any;
  ngOnInit() {
    this.Socket.connect();
    this.AuthHandler.GET_auth_status();
    this.UserHandler.GET_active_friends();
    this.Socket.listen('test_response').subscribe((data) => {
      console.log(data);
    })
    // this.AuthHandler.Test_Db();
    // this.Socket.listen('Test_Db_response').subscribe((data: any) => {
    //   console.log(data);
    // })
    this.Socket.listen('connect_error').subscribe((data: any) => {
      if (data !== null) {
        window.location.reload()
      }
    });
    this.State.active_conversations.subscribe((data: any) => {
      this.active_conversations = data;
    })
  }
  ngAfterViewInit() {
    // console.log(this.message_placement.nativeElement.children.length);
  }
}



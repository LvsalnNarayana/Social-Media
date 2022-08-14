import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageHandlerService } from '../services/socket/message-handler.service';
import { StateVariablesService } from '../services/socket/state-variables.service';
import { UserHandlerService } from '../services/socket/user-handler.service';

@Component({
  selector: 'main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('notification_container') notification_container !: ElementRef
  constructor(
    public state: StateVariablesService,
    private UserHandler: UserHandlerService,
  ) { }
  search_form!: FormGroup;
  search_data: any = [];
  search_results_toggle = false;
  pending_requests: any = null;
  request_length = 0;
  user_messages: any;
  @ViewChild('search_results') search_results!: ElementRef
  ngOnInit(): void {
    this.UserHandler.GET_friend_invitations();
    document.addEventListener('click', (e) => {
      if (this.search_results?.nativeElement != undefined) {
        if (e.target != this.search_results.nativeElement) {
          this.search_results_toggle = false
        }
      }
    })
    this.search_form = new FormGroup({
      'search_text': new FormControl(null)
    });
    this.search_form.get('search_text')?.valueChanges.subscribe((data) => {
      if (data !== null && data !== '' && data !== undefined) {
        this.UserHandler.GET_search_user(data)
      } else {
        this.search_results_toggle = false
      }
    });
    this.state.search_users.subscribe((data) => {
      this.search_data = data;
      if (data.length > 0) {
        this.search_results_toggle = true
      }
    })
    this.state.friend_invitations.subscribe((data: any) => {
      this.pending_requests = data;
      this.request_length = data?.length;
    })
    this.state.user_messages.subscribe((data: any) => {
      this.user_messages = data;
    })
  }
  accept_friend(sender_id: any) {
    this.UserHandler.POST_accept_invitation(sender_id)
  }
  reject_friend(sender_id: any) {
    this.UserHandler.POST_reject_invitation(sender_id)
  }
  open_conversation(user: any) {
    this.state.add_conversation(user);
  }
}

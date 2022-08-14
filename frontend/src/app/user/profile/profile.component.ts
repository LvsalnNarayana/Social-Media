import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StateVariablesService } from 'src/app/services/socket/state-variables.service';
import { UserHandlerService } from 'src/app/services/socket/user-handler.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private State: StateVariablesService,
    private UserHandler: UserHandlerService
  ) { }

  user_data: any = null;
  tab = 'posts';
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const username = params['username'];
      this.UserHandler.GET_search_user_profile(username);
      this.State.search_user_profile.subscribe((data: any) => {
        this.user_data = data;
      })
    })
  }
  add_friend(receiver_id: any, username: any) {
    this.UserHandler.POST_invitation(receiver_id, username);
  }
  open_conversation(user: any) {
    this.State.add_conversation(user);
  }
}

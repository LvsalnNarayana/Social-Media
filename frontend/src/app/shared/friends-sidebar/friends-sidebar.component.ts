import { Component, OnInit } from '@angular/core';
import { StateVariablesService } from 'src/app/services/socket/state-variables.service';

@Component({
  selector: 'app-friends-sidebar',
  templateUrl: './friends-sidebar.component.html',
  styleUrls: ['./friends-sidebar.component.css']
})
export class FriendsSidebarComponent implements OnInit {

  constructor(
    private State: StateVariablesService
  ) { }
  active_friends: any;
  ngOnInit(): void {
    this.State.active_friends.subscribe((data:any) => {
      this.active_friends = data;
    });
  }
  open_conversation(user: any) {
    this.State.add_conversation(user);
  }

}

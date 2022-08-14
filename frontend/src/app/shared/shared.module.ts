import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsSidebarComponent } from './friends-sidebar/friends-sidebar.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FriendsSidebarComponent,
    MessageBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FriendsSidebarComponent,
    MessageBoxComponent
  ]
})
export class SharedModule { }

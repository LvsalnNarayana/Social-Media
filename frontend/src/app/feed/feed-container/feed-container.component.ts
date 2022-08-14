import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PostHandler } from 'src/app/services/socket/post-handler.service';
import { StateVariablesService } from 'src/app/services/socket/state-variables.service';

@Component({
  selector: 'app-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: ['./feed-container.component.css']
})
export class FeedContainerComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private State: StateVariablesService,
    private PostHandler: PostHandler
  ) { }
  user: any = null;
  posts: any = [];
  ngOnInit(): void {
    this.PostHandler.GET_posts();
    this.State.posts.subscribe((data) => {
      this.posts = data;
    })
    this.State.user.subscribe((data) => {
      this.user = data
    })
  }
  create_post_focus() {
    this.dialog.open(CreatePostComponent, {
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      backdropClass: 'modal_backdrop',
      width: '500px',
      minHeight: '200px',
      maxWidth: '500px'
    })
  }
}
@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  constructor(
    public dialogRef: MatDialogRef<CreatePostComponent>,
    private State: StateVariablesService,
    private PostHandler: PostHandler
  ) { }
  user: any = null;
  post_form!: FormGroup;
  post_type_set: string = 'only_me';
  ngOnInit(): void {
    this.State.user.subscribe((data) => {
      this.user = data
    });
    this.post_form = new FormGroup({
      'post_desc': new FormControl('', Validators.required)
    });
  }
  close_dialog() {
    this.dialogRef.close()
  }
  change_post_type(data: any) {
    this.post_type_set = data;
  }
  create_post() {
    const new_post = {
      post_type: this.post_type_set,
      post_desc: this.post_form.get('post_desc')?.value
    }
    this.PostHandler.POST_create_post(new_post).subscribe((data) => {
      if (data.status === 200) {
        this.post_form.get('post_desc')?.patchValue('');
        this.close_dialog();
      }
    });
  }
}

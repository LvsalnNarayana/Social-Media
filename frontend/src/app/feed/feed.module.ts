import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedRoutingModule } from './feed-routing.module';
import { PostComponent } from './post/post.component';
import { CreatePostComponent, FeedContainerComponent } from './feed-container/feed-container.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PostComponent,
    FeedContainerComponent,
    CreatePostComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PostComponent,
    FeedContainerComponent,
    CreatePostComponent
  ]
})
export class FeedModule { }

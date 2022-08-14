import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import { FeedModule } from '../feed/feed.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HomepageComponent,
  ],
  imports: [
    CommonModule,
    FeedModule,
    SharedModule
  ]
})
export class PagesModule { }

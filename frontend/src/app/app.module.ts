import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { Socket } from './services/socket/socket.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderDropdownComponent } from './header/header-dropdown/header-dropdown.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AuthHandler } from './services/socket/auth-handler.service';
import { PostHandler } from './services/socket/post-handler.service';
import { FeedModule } from './feed/feed.module';
import { PagesModule } from './pages/pages.module';
import { UserHandlerService } from './services/socket/user-handler.service';
import { SharedModule } from './shared/shared.module';
import { MessageHandlerService } from './services/socket/message-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderDropdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FeedModule,
    PagesModule,
    SharedModule
  ],
  exports: [
    MaterialModule,
    FeedModule,
    SharedModule
  ],
  providers: [
    Socket,
    AuthHandler,
    PostHandler,
    UserHandlerService,
    MessageHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

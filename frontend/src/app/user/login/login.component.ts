import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthHandler } from 'src/app/services/socket/auth-handler.service';
import { StateVariablesService } from 'src/app/services/socket/state-variables.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private AuthHandler: AuthHandler,
    public state: StateVariablesService
  ) { }
  login_form!: FormGroup
  ngOnInit(): void {
    this.login_form = new FormGroup({
      'username': new FormControl(null),
      'password': new FormControl(null)
    });
  }
  login_submit() {
    const data = {
      username: this.login_form.value?.username,
      password: this.login_form.value?.password,
    }
    this.AuthHandler.POST_login_request(data)
  }
}


import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    email: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit(): void { }

  onSubmit(): void {
    console.log(this.loginForm.value);
    let user = this.loginForm.value;
    this.authService.login(user.email, user.password);
  }

}

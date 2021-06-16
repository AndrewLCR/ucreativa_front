import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.authService.currentUser.subscribe((x: User) => this.currentUser = x);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

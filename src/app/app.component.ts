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
  userLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    //this.authService.currentUser.subscribe((x: User) => this.currentUser = x);
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      console.log(loggedIn);
      if (!loggedIn) {
        this.userLoggedIn = false;
        this.router.navigate(['/login']);
      } else {
        this.userLoggedIn = true;
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

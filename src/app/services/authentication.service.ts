import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<unknown>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  register(name: string, email: string, password: string, c_password: string) {
    this.http.post<any>(`${environment.apiUrl}/register`, { name, email, password, c_password }).subscribe(response => {
      console.log(response);
      if (response.success === true) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('currentUser', JSON.stringify(response.data));

        this.router.navigate(['/dashboard']);
      } else { }
    })
  }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(map((user: User) => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    this.currentUserSubject.next(null);
  }
}
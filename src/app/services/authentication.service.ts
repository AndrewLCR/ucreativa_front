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

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get isLoggedIn() {
    let currentUser = localStorage.getItem('token');
    if (currentUser) {
      this.loggedIn.next(true)
    }

    return this.loggedIn.asObservable();
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

        this.loggedIn.next(true);
        this.router.navigate(['/dashboard']);
      } else {
        this.loggedIn.next(false);
      }
    })
  }

  login(email: string, password: string) {
    this.http.post<any>(`${environment.apiUrl}/login`, { email, password }).subscribe(response => {
      if (response.success === true) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('currentUser', JSON.stringify(response.data));

        this.router.navigate(['/dashboard']);
      }
    })
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    this.loggedIn.next(false);
  }
}
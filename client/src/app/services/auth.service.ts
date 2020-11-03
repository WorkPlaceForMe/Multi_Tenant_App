import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { api } from '../models/API';

const AUTH_API = `${api}/auth/`;

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'now_user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  private users: Observable<any[]>;
  public now_user;
  constructor(
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private http: HttpClient
  ) {
    // this.auth()
  }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user,type): Observable<any> {
    return this.http.post(AUTH_API + 'signup/' + type, {
      username: user.username,
      email: user.email,
      password: user.password,
      unique: user.unique,
      algorithm: user.algorithm
    }, httpOptions);
  }

  signOut() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.router.navigate(['/'])
  }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('now_user'));
    return (user !== null) ? true : false;
  }

  get isOtp(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.email !== null) ? true : false;
  }

  get isSetUp(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return (token !== null) ? true : false;
  }

  get isAdminClientBranch(): boolean{
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.role !== "user";
  }

  get isClientBranch(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.role == "client" && now_user.id_branch != "0000";
  }

  get isClientorBranch(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && (now_user.role == "client" || now_user.role == 'branch');
  }

  get isAdmin(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.role == "admin";
  }

  get isBranch(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.role == "branch";
  }
  
  get isClient(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.role == "client";
  }

  get isUser(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.role == "user";
  }

  public saveToken(token: string) {
    // window.sessionStorage.removeItem(TOKEN_KEY);
    // window.sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY)
  }

  public saveUser(user) {
    localStorage.removeItem(USER_KEY)
    localStorage.setItem(USER_KEY , JSON.stringify(user))
    // window.sessionStorage.removeItem(USER_KEY);
    // window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }
}

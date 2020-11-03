import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable } from 'rxjs';
import { FacesService } from '../services/faces.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public facesService: FacesService
  ){ }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.isLoggedIn !== true) {
        return this.router.navigate(['pages/sign-in'])
      }
      this.facesService.mess().subscribe(
        res => {},
        err => {
          console.log(err)
          window.alert("Your session has expired, please log in again.");
          this.authService.signOut()
        }
      )
      return true;
    }
}

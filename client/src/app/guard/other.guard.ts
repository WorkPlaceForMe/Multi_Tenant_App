import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable } from 'rxjs';
import { FacesService } from '../services/faces.service';

@Injectable({
  providedIn: 'root'
})
export class OtherGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public facesService: FacesService
  ){ }
  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isClientorBranch !== true){
      if(this.authService.isLoggedIn !== true) {
            // window.location.reload()
            return this.router.navigate(['/pages/sign-in'])
      //   this.authService.signOut(JSON.parse(localStorage.getItem('now_user'))['username']).subscribe(
      //     res=>{
      //       window.localStorage.clear();
      //       window.sessionStorage.clear();
      //       // window.location.reload()
      //       this.router.navigate(['/pages'])
      //     }, err =>{ 
      //       console.error(err)
      //       window.localStorage.clear();
      //       window.sessionStorage.clear();
      //       // window.location.reload()
      //       this.router.navigate(['/pages'])
      //     }
      // )
      } else {
        return this.router.navigate(['/pages/graphs'])
      }
    }
    this.facesService.mess().subscribe(
      res => {
        // console.log(res)
      },
      err => {
        console.log(err)
            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.reload()
            this.router.navigate(['/pages'])
            window.alert("Your session has expired, please log in again.");
      //   this.authService.signOut(JSON.parse(localStorage.getItem('now_user'))['username']).subscribe(
      //     res=>{
      //       window.localStorage.clear();
      //       window.sessionStorage.clear();
      //       // window.location.reload()
      //       this.router.navigate(['/pages'])
      //     }, err =>{ 
      //       console.error(err)
      //       window.localStorage.clear();
      //       window.sessionStorage.clear();
      //       // window.location.reload()
      //       this.router.navigate(['/pages'])
      //     }
      // )
      }
    )
    return true;
    }
}

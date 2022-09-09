import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { FacesService } from '../services/faces.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{
constructor(
    public authService: AuthService,
    public router: Router,
    public facesService: FacesService
  ){ }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.isAdminClientBranch !== true){
        if(this.authService.isLoggedIn !== true) {
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
          return this.router.navigate(['/pages/accounts'])
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

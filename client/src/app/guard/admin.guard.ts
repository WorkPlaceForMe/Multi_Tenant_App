import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { FacesService } from "../services/faces.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public facesService: FacesService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAdminClientBranch !== true) {
      if (this.authService.isLoggedIn !== true) {
        return this.router.navigate(["/pages/sign-in"]);
      } else {
        return new Promise((resolve, reject) => {
          this.facesService.mess().subscribe(
            (res) => {
              return this.router.navigate(["/pages/accounts"]);
              return resolve(true);
            },
            (err) => {
              window.localStorage.clear();
              window.sessionStorage.clear();
              window.location.reload();

              return resolve(false);
            }
          );
        });
      }
    }
  }
}

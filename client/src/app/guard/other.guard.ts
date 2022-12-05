import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { FacesService } from "../services/faces.service";

@Injectable({
  providedIn: "root",
})
export class OtherGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public facesService: FacesService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isClientorBranch !== true) {
      if (this.authService.isLoggedIn !== true) {
        return this.router.navigate(["/pages/sign-in"]);
      } else {
        return new Promise((resolve, reject) => {
          this.facesService.mess().subscribe(
            (res) => {
              return this.router.navigate(["/pages/graphs"]);
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

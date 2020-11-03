import { Component } from '@angular/core';
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf='authService.isLoggedIn == true'>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive *ngIf='authService.isLoggedIn == true'>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
constructor(public authService: AuthService){}
}

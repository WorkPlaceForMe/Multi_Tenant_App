import { Component, Input } from '@angular/core';
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf='authService.isLoggedIn == true && showHeader'>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar state="collapsed" class="menu-sidebar" tag="menu-sidebar" responsive *ngIf='authService.isLoggedIn == true'>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  @Input() showHeader: true;
constructor(public authService: AuthService){}
}

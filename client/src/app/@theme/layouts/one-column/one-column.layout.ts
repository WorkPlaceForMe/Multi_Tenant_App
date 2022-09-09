import { Component, Input } from '@angular/core';
import { ThreeColumnsLayoutComponent } from '..';
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header display = "none" fixed *ngIf='authService.isLoggedIn == true && showHeader'>
        <ngx-header *ngIf = "showHeader"></ngx-header>
      </nb-layout-header>

      <nb-sidebar #sidebar [state]="state" class="menu-sidebar" tag="menu-sidebar" responsive *ngIf='authService.isLoggedIn == true' [ngStyle]='display()'>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column  [ngClass]="{'no-padding': !showHeader}" >
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>xx
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  @Input() showHeader: true;
  @Input() state: true;
  @Input() show:boolean;
constructor(public authService: AuthService){}

display(){
  let show;
  if(this.show == true){
    show = '';
  }else{
    show = 'none'
  }
  let nc ={
    'display': show,
  }
  return nc;
}
}

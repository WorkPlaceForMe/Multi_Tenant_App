import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from "../services/auth.service";

import { MENU_ITEMSADMIN, MENU_ITEMSBRANCH, MENU_ITEMSCLIENT, MENU_ITEMSUSER } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout [showHeader] = showHeader>
      <nb-menu [items]="menuAdmin" *ngIf='authService.isAdmin'></nb-menu>
      <nb-menu [items]="menuClient" *ngIf='authService.isClient && !authService.isClientBranch'></nb-menu>
      <nb-menu [items]="menuBranch" *ngIf='authService.isBranch || authService.isClientBranch'></nb-menu>
      <nb-menu [items]="menuUser" *ngIf='authService.isUser'></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  hola: string = 'Made By Alex Kaiser';
  contact: string = 'i93kaiser@hotmail.com';
  showHeader: boolean;
  menuAdmin = MENU_ITEMSADMIN;
  menuClient = MENU_ITEMSCLIENT;
  menuBranch = MENU_ITEMSBRANCH;
  menuUser = MENU_ITEMSUSER;

  constructor( public authService: AuthService, private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        console.log(val.url);
        if(val.url == '/pages/graphs'){
          this.showHeader = false;
        }else{
          this.showHeader = true;
        }
      }
  });
  }
}




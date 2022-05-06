import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { Router, NavigationEnd } from '@angular/router'
import { MENU_ITEMSADMIN, MENU_ITEMSBRANCH, MENU_ITEMSCLIENT, MENU_ITEMSUSER } from './pages-menu';
import { FacesService } from '../services/faces.service'

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout [showHeader] = "showHeader" [state] = "state" [show] = "show">
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
  showHeader: boolean = false;
  state: string = "collapsed";
  show:boolean = false;
  menuAdmin = MENU_ITEMSADMIN;
  menuClient = MENU_ITEMSCLIENT;
  menuBranch = MENU_ITEMSBRANCH;
  menuUser = MENU_ITEMSUSER;
  fr = {              
    title: 'FR Users',
    icon: 'browser-outline',
    link: 'management'
  }

  constructor( public authService: AuthService, private router: Router, private service: FacesService) {
    if(authService.isLoggedIn && !authService.isAdmin){
      this.service.getDashboard().subscribe(
        res => {
          for(const alg of res['data']['analyticsT']){
            if(alg.algo_id === 0){
              this.menuClient.push(this.fr)
              this.menuBranch.push(this.fr)
            }
          }
        },
        err => console.error(err)
      )
    }
    if(authService.isAdmin){
      router
    }
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(val.url == '/pages/graphs'){
          this.showHeader = false;
          this.state = "collapsed";
        }else{
          this.show = true
          this.showHeader = true;
          this.state = "compacted";
        }
        if(val.url.split('/').length === 7 ){
          this.state ="collapsed"
          this.showHeader = false;
        }
        
      }
  });
  }
}

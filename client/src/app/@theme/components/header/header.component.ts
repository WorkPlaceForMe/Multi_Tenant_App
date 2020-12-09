import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { api } from '../../../models/API'
<<<<<<< HEAD
import { Account } from '../../../models/Account';
=======
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'dark';
  pic: string;
<<<<<<< HEAD
  now_user: Account;
=======
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
<<<<<<< HEAD
              public authservice: AuthService,
              public router: Router
              ) {
                this.pic = `${api}/pictures/logo.png`
  }

  logOut(){
    this.authservice.signOut(this.now_user.username).subscribe(
        res=>{
          window.localStorage.clear();
          window.sessionStorage.clear();
          window.location.reload()
          // this.router.navigate(['/'])
        }, err =>{ 
          console.error(err)
          window.localStorage.clear();
          window.sessionStorage.clear();
          window.location.reload()
        }
    )
  }

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
=======
              public authservice: AuthService) {
                this.pic = `${api}/pictures/logo.png`
  }

  ngOnInit() {
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}

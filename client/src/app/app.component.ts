/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { TimezoneService } from './services/timezone.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
   
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService,private timezone: TimezoneService,
    private authService: AuthService,) {

  }

info:any;
  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.info = JSON.parse(localStorage.getItem('info'))
    if (this.info === null) {
      const timeZoneOffset = new Date().getTimezoneOffset();
      this.authService.saveInfo({
        timezone: this.timezone.offSetToTimezone(timeZoneOffset)
      });
    }
  }
}

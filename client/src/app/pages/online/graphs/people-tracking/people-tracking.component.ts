import { DatePipe } from '@angular/common'
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { NbCalendarRange, NbThemeService } from '@nebular/theme'
import { DomSanitizer } from '@angular/platform-browser'
import { FacesService } from '../../../../services/faces.service'

@Component({
  selector: 'ngx-people-tracking',
  templateUrl: './people-tracking.component.html',
  styleUrls: ['./people-tracking.component.scss']
})
export class PeopleTrackingComponent implements OnInit {
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  timezone: any;
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public datepipe: DatePipe,
    public sanitizer: DomSanitizer,
    private face: FacesService
  ) {}

  rtspIn: any;
  video:boolean = false;

  @ViewChild('streaming', { static: false }) streamingcanvas: ElementRef;

  ngOnInit (): void {
    this.face.checkVideo(51, this.camera).subscribe(
      res => {
        // eslint-disable-next-line dot-notation
        this.video = res['video']
        // eslint-disable-next-line dot-notation
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(res['http_out'])
      }, err => console.error(err)
    )
  }
}

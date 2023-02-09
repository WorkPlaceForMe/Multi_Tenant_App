import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbThemeService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { WindowOpenerComponent } from '../window-opener/window-opener.component';
import { SeverityComponent } from '../../severity/severity.component';
import { utils, writeFileXLSX } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'ngx-illegal-parking',
  templateUrl: './illegal-parking.component.html',
  styleUrls: ['./illegal-parking.component.scss', '../smart-table.scss']
})

export class IllegalParkingComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  parking: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};

  @ViewChild('streaming', { static: false }) streamingcanvas: ElementRef;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router,
  ) { }
  single: any;
  colorScheme: any;
  source: any = new LocalDataSource();
  dataL: any;
  optionsL: any;
  algo_id: number = 4;

  ngOnDestroy() {
    if (this.player !== undefined) {
      this.player.destroy();
      this.face.cameraStop({ id: this.camera }).subscribe(
        res => {
        },
        err => console.error(err),
      );
    }
  }

  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  videoFile: string = '';
  pass(vid: string) {
    this.videoplayer.nativeElement.src = vid;
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();

  }

  video: boolean = false;
  rtspIn: any;

  ngOnInit(): void {
    // // if(api.length <= 4){
    //   if(api.length <= 1){
    //   setTimeout(()=>{
    //     this.face.camera({id: this.camera}).subscribe(
    //       res =>{
    //         console.log(res)
    //         this.player = new JSMpeg.Player(`ws://localhost:${res['port']}`, {
    //           canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
    //         })
    //       },
    //       err=> console.error(err)
    //     )
    //   },500)
    // }
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    const time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0, 3);
    this.timezone = parseInt(this.timezone);
    let p = '';
    if (this.timezone > 0) {
      p = '+';
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
    let type;
    if (this.now_user.id_branch !== '0000') {
      type = 'cam_id';
    } else {
      type = 'id_account';
    }
    const l = {
      start: this.range.start,
      end: this.range.end,
      type: type,
    };
    this.face.checkVideo(this.algo_id, this.camera).subscribe(
      res => {
        this.video = res['video'];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(res['http_out']);
        if (this.video === true) {
          this.settings['columns']['picture'] = {
            title: 'VIDEO',
            type: 'custom',
            filter: false,
            renderComponent: ButtonViewComponent,
            onComponentInitFunction: (instance) => {
              instance.save.subscribe((row: string)  => {
                this.pass(row);
              });
            },
          };
          this.settings = Object.assign({}, this.settings);
        }
      }, err => console.error(err),
    );
    this.serv.parking(this.camera, l).subscribe(
      res => {
        this.parking = res['data'];
        for (const m of this.parking.raw) {
          m['picture'] = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/parking/' + m['cam_id'] + '/' + m['picture']);
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', '+0530');
          m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/parking/' + m['cam_id'] + '/' + m['movie']);
        }
        this.source = this.parking.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
      },
      err => {
        console.error(err);
        this.parking = undefined;
      },
    );

  }
  got(id) {
    this.route.navigate([`/pages/tickets`]);
  }
  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'ACTIONS',
      add: false,
      edit: true,
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: 'No data found',
    columns: {
      picture: {
        title: 'PHOTO',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
      movie: {
        title: 'VIDEO',
        type: 'custom',
        filter: false,
        renderComponent: WindowOpenerComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
      time: {
        title: 'TIME',
        type: 'string',
        filter: false,
      },
      cam_name: {
        title: 'CAM',
        type: 'string',
        filter: false,
      },
      // severity: {
      //   title: 'SEVERITY',
      //   type: 'string',
      //   filter: false
      // },
      level: {
        title: 'SEVERITY',
        type: 'custom',
        filter: false,
        renderComponent: SeverityComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
    },
  };


  csvAlerts: Object = {
    alerts: false,
    count: false
  }
  showAlert: boolean = false;
  showData: boolean = false;

  async csv(algo){
    this.csvAlerts[algo] = true
    let type;
    if(this.now_user.id_branch != '0000'){
      type = 'cam_id';
    }else{
      type = 'id_account'
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type,
      ham: true,
      algo: algo
    }
    ;(await this.serv.report1(this.algo_id, this.camera, l)).subscribe(
      async (res) => {
        let data: Array<any>;
        data = res['data']
        for (let m of data) {
          m['picture'] = 'http://localhost' + api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/parking/' + m['cam_id'] + '/' + m['picture']
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', '+0530');
        }
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        await writeFileXLSX(wb, `${uuidv4()}.xlsx`);
        this.csvAlerts[algo] = false
      },
      err => {
        console.error(err)
        this.csvAlerts[algo] = false
        if(algo === 'count'){
          this.showData = true;
        }
        if(algo === 'alerts'){
          this.showAlert = true;
        }
      }
    )
  }
}

@Component({
  selector: 'button-view',
  template: `
    <img [src]="rowData.picture" width='60' height='60'>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {

  constructor() {
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}




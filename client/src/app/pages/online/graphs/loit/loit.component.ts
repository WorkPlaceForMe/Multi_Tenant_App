import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NbCalendarRange, NbThemeService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { Account } from '../../../../models/Account';
import { AnalyticsService } from '../../../../services/analytics.service';
import { DomSanitizer } from '@angular/platform-browser';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-loit',
  templateUrl: './loit.component.html',
  styleUrls: ['./loit.component.scss']
})
export class LoitComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  timezone: any;
  now_user: Account;
  constructor(
    private serv: AnalyticsService,
    private theme: NbThemeService,
    public datepipe: DatePipe, 
    public sanitizer: DomSanitizer,
    private face: FacesService,
    private route: Router
  ) {}

  themeSubscription: any;
  loitering: any;
  dataH: any;
  optionsH: any;
  dataL: any;
  optionsL: any;
  player: any;

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  ngOnDestroy(){
    if(this.player != undefined){
      this.player.destroy()
      this.face.cameraStop({id: this.camera}).subscribe(
        res =>{
        },
        err=> console.error(err)
      )
    }
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
  videoFile:string = "";
  pass(vid:string){
    this.videoplayer.nativeElement.src = vid    
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();

  }
  video:boolean = false;

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    var time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0,3);
    let aaa = this.timezone;
    this.timezone = parseInt(this.timezone) * 2;
    let p = ''
    if(this.timezone > 0){
      p = '+'
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
    let type;
    if(this.now_user.id_branch != '0000'){
      type = 'cam_id';
    }else{
      type = 'id_account'
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type
    }
    this.face.checkVideo(2,this.camera).subscribe(
      res=>{
        this.video = res['video']
        if(this.video === true){
          this.settings['columns']['clip_path'] = {
            title: 'VIDEO',
            type: 'custom',
            filter: false,
            renderComponent: ButtonViewComponent,
            onComponentInitFunction:(instance) => {
              instance.save.subscribe((row: string)  => {
                this.pass(row)
              });
            }
          }
          this.settings = Object.assign({},this.settings)
        }
      }, err => console.error(err)
    )
    this.serv.loitering(this.camera,l).subscribe(
      res=>{
        this.loitering = res['data']
        for(var m of this.loitering.raw){
          m['clip_path']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/loitering/' + m['cam_id'] + '/' + m['clip_path'])
          m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/loitering/' + m['cam_id'] + '/' + m['picture'])
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', this.timezone)
        }
        this.source = this.loitering.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))
        if(Object.keys(this.loitering.histogram).length != 0){
          let labels = []
          for(var o of Object.keys(this.loitering.histogram)){
            labels.push(JSON.stringify(parseInt(o) + parseInt(aaa))+' hrs')
          }
          let times = []
          for(var q of this.loitering.labelsD){
            times.push(this.datepipe.transform(q, 'yyyy-M-dd HH:mm', this.timezone))
          }

          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;
        
            this.dataH = {
              labels: labels,
              datasets: [{
                  label: 'Loitering',
                  backgroundColor: colors.infoLight,
                  borderWidth: 1,
                  data: Object.values(this.loitering.histogram),
                }
              ],
            };
        
            this.optionsH = {
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                rectangle: {
                  borderWidth: 2,
                },
              },
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      min: 0,
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
                yAxes: [
                  {
                    gridLines: {
                      display: false,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
              },
              legend:{
                display:false
              }
            };

            this.dataL = {
              labels: times,
              datasets: [{
                label: 'Loitering',
                data: this.loitering.dwell,
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                fill: false,
                // borderDash: [2, 2],
                pointRadius: 2,
                pointHoverRadius: 5,
              }],
            };
      
            this.optionsL = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: 'bottom',
                labels: {
                  fontColor: chartjs.textColor,
                },
              },
              hover: {
                mode: 'index',
              },
              scales: {
                xAxes: [
                  {
                    display: false,
                    scaleLabel: {
                      display: false,
                      labelString: 'Month',
                    },
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Value',
                    },
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
              },
            };
          });
        }
      },
      err => console.error(err)
    )
  }

  source:any = new LocalDataSource();

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: true,
      columnTitle: 'ACTIONS',
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager : {
      display : true,
      perPage:5
      },
    noDataMessage: "No data found",
    columns: {
      track_id: {
        title: 'ID',
        type: 'string',
        filter: false
      },
      picture: {
        title: 'PICTURE',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction:(instance) => {
          instance.save.subscribe((row: string)  => {
          });
        }
      },
      time: {
        title: 'TIME',
        type: 'string',
        filter: false
      },
      dwell: {
        title: 'DWELL TIME',
        type: 'string',
        filter: false
      },
      camera_name: {
        title: 'CAM',
        type: 'string',
        filter: false
      },
      alert: {
        title: 'SEVERITY',
        type: 'string',
        filter: false
      }
    },
  };

  got(id){
    this.route.navigate([`/pages/tickets`])
  }
}

@Component({
  selector: 'button-view',
  template: `
    <button class='btn btn-primary btn-block' (click)="openVideo()"><i class="fas fa-play-circle"></i></button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openVideo(){
    this.save.emit(this.rowData.picture)
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}

@Component({
  selector: 'button-view',
  template: `
    <img [src]="rowData.picture" width='60' height='60'>
  `,
})
export class ButtonViewComponentPic implements ViewCell, OnInit {

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}

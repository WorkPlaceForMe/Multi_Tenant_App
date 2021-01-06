import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbColorHelper, NbThemeService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';

@Component({
  selector: 'ngx-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss', '../smart-table.scss']
})
export class SocialComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  social: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private theme: NbThemeService,
    private route: Router
  ) { }
  single: any;
  colorScheme: any;
  source:any = new LocalDataSource();
  dataL: any;
  optionsL: any;

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

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    var time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0,3);
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
      this.serv.social(this.camera,l).subscribe(
        res=>{
          this.social = res['data']
          for(var m of this.social.raw){
            m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/social/' + m['cam_id'] + '/' + m['clip_path'])
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', this.timezone)
            switch(m['alert_type']){
              case '0':{
                m['alert_type'] = 'Low';
                break;
              }
              case '1':{
                m['alert_type'] = 'Mid';
                break;
              }
              case '2':{
                m['alert_type'] = 'High';
                break;
              }
            }
          }
          this.source = this.social.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))

          let labels = []
          for(var o of Object.keys(this.social.over)){
            o = o + ':00:00'
            labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm', this.timezone))
          }

          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.dataL = {
              labels: labels,
              datasets: [{
                label: 'Social Distancing Over Time',
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.social.over),
                borderColor: colors.primary,
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
        },
        err => {
          console.error(err)
          this.social = undefined;
        }
      )

  }
  got(id){
    this.route.navigate([`/pages/tickets`])
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
    pager : {
      display : true,
      perPage:5
      },
    noDataMessage: "No data found",
    columns: {
      picture: {
        title: 'VIDEO',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction:(instance) => {
          instance.save.subscribe((row: string)  => {
            this.pass(row)
          });
        }
      },
      time: {
        title: 'TIME',
        type: 'string',
        filter: false
      },
      cam_name: {
        title: 'CAM',
        type: 'string',
        filter: false
      },
      alert_type: {
        title: 'SEVERITY',
        type: 'string',
        filter: false
      }
    },
  };

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
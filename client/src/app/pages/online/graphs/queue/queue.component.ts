import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbThemeService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';

@Component({
  selector: 'ngx-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss', '../smart-table.scss']
})
export class QueueComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  queue: any = [];
  player: any;
  now_user: Account;
  rtspIn: any;
  queues: Array<any> = [];
  themeSubscription: any;
  dataL: any;
  dataM: any;
  dataH: any;
  dataP: any;
  options: any;

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private theme: NbThemeService,
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router
  ) { }
  source:any = new LocalDataSource();

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
    timezone: any;
  video:boolean = false;
  algo_id: number = 22;

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    var time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0,3);
    this.timezone = parseInt(this.timezone);
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
    this.face.checkVideo(this.algo_id,this.camera).subscribe(
      res=>{
        this.video = res['video'];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(res['http_out']);
        if(this.video === true){
          this.settings['columns']['picture'] = {
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
      this.serv.queue(this.camera,l).subscribe(
        res=>{
          this.queue = res['data']
          for(let m of this.queue.rawAlerts){
            m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/queue/' + m['cam_id'] + '/' + m['picture'])
            m['clip_path']  = api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/queue/' + m['cam_id'] + '/' + m['clip_path']
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss','-0400')
            m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/queue/' + m['cam_id'] + '/' + m['movie']);
            if(m.queuing === 1){
              m.inLine = 'Waiting'
            }else{
              m.inLine = 'Exit'
            }
          }
          for(const qu in this.queue.countAll){
            this.queues.push({zone: qu, amount: this.queue.countAll[qu]})
          }
          const source = this.queue.rawAlerts.filter( alert => alert.severity === 2 )
          // this.source = this.queue.raw.slice().sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time))
          this.source = source.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))
          const labels = []
          for (let o of Object.keys(this.queue.dataAlertsLow[0])){
            o = o + ':00';
            labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm','-0400'));
          }
          let times = [];
          for (var q of Object.keys(this.queue.dataPeople)) {
            times.push(this.datepipe.transform(q, "yyyy-M-dd HH:mm", '-0400'));
          }
    
          this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
            const colors: any = config.variables;
            const cols = {
              0: colors.primary,
              1: colors.warning,
              2: colors.success,
              3: colors.info,
              4: colors.danger
            }
            const chartjs: any = config.variables.chartjs;
            const datasetsLow = [], datasetsMed = [], datasetsHigh = []
            for(let i = 0; i < this.queue.dataAlertsLow.length; i++){
              datasetsLow.push({
                label: `Queue: ${i + 1}`,
                data: Object.values(this.queue.dataAlertsLow[i]),
                borderColor: cols[i],
                backgroundColor: cols[i],
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              })
              datasetsMed.push({
                label: `Queue: ${i + 1}`,
                data: Object.values(this.queue.dataAlertsMed[i]),
                borderColor: cols[i],
                backgroundColor: cols[i],
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              })
              datasetsHigh.push({
                label: `Queue: ${i + 1}`,
                data: Object.values(this.queue.dataAlertsHigh[i]),
                borderColor: cols[i],
                backgroundColor: cols[i],
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              })
            }
            this.dataL = {
              labels: labels,
              datasets: datasetsLow,
            };
            this.dataH = {
              labels: labels,
              datasets: datasetsHigh,
            };
            this.dataM = {
              labels: labels,
              datasets: datasetsMed,
            };

            this.dataP = {
              labels: times,
              datasets: [{
                label: `People over time`,
                data: Object.values(this.queue.dataPeople),
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              },]
            };
            this.options = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                position: "bottom",
                labels: {
                  fontColor: chartjs.textColor,
                },
              },
              hover: {
                mode: "index",
              },
              scales: {
                xAxes: [
                  {
                    display: false,
                    scaleLabel: {
                      display: false,
                      labelString: "Month",
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
                      display: true,
                      // labelString: 'Value',
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
          }
        )
        },
        err => {
          console.error(err)
          this.queue = undefined;
        }
      )
  }
  got(id){
    this.route.navigate([`/pages/tickets`])
  }
  goToLink(url: string){
    window.open(url, "_blank");
  }

  csv(algo){
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
    this.serv.report(this.algo_id,this.camera, l).subscribe(
      res => {
        var blob = new Blob([res], { type: res.type.toString() });
        var url = window.URL.createObjectURL(blob);
        this.goToLink(url)
      },
      err => console.error(err)
    )
  }

  settings = {
    mode: 'external',
    actions: false,
    edit: {
      editButtonContent: '<i class="fa fa-ellipsis-h"></i>',
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
        title: 'PICTURE',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponentPic,
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
      camera_name: {
        title: 'CAM',
        type: 'string',
        filter: false
      },  
      zone: {
        title: 'QUEUE',
        type: 'string',
        filter: false
      }
    },
  };

}

@Component({
  selector: 'button-view',
  styles: ['.play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}'],
  template: `
  <div >
  <div style = "width:60px; height: 60px">
    <img [src]="rowData.picture" width='60' height='60'>
    <button class='btn btn-link play-btn' (click)="openVideo()"><i class="fas fa-play"></i></button>
  </div>
</div>
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
    this.save.emit(this.rowData.clip_path)
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

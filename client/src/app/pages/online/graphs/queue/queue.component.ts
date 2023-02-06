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
import { utils, writeFileXLSX } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

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
  avgss: Array<any> = [];
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
      type: type,
      timezone: '-0300'
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
          let secondsString
          if(this.queue.avg >= 60){
            let minutes = Math.floor(this.queue.avg / 60);
            let seconds = Math.round(this.queue.avg - minutes * 60);
            if(seconds < 10){
              secondsString = `0${seconds}`
            }else{
              secondsString = seconds
            }
            this.queue.avg = `${minutes}:${secondsString}`
          }else{
            if(this.queue.avg < 10){
              secondsString = `0${ Math.round(this.queue.avg)}`
            }else{
              secondsString =  Math.round(this.queue.avg)
            }
            this.queue.avg = `0:${secondsString}`
          }
          for(let s of this.queue.avgs){
            let secondsStr
            if(s >= 60){
              let minutes = Math.floor(s / 60);
              let seconds = Math.round(s - minutes * 60);
              if(seconds < 10){
                secondsStr = `0${seconds}`
              }else{
                secondsStr = seconds
              }
              s = `${minutes}:${secondsStr}`
              this.avgss.push(s)
            }else{
              // console.log(s,'--')
              if(s < 10){
                // console.log(s,'==')
                secondsStr = `0${s}`
                // console.log(secondsStr,'==')
              }else{
                secondsStr = s
              }
              // console.log(secondsStr,'++')
              s = `0:${secondsStr}`
              this.avgss.push(s)
            }
          }
          // console.log(this.queue.avgs)
          // this.avgss = this.queue.avgs
          for(let m of this.queue.rawAlerts){
            m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/queue/' + m['cam_id'] + '/' + m['picture'])
            m['clip_path']  = api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/queue/' + m['cam_id'] + '/' + m['clip_path']
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss','-0300')
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
          const labels = [], lab = {}
          for (let o of Object.keys(this.queue.dataAlertsLow[0])){
            lab[this.datepipe.transform(o, 'yyyy-M-dd HH:mm','-0300')] = this.queue.dataAlertsLow[0][o]
            o = o + ':00';
            const date = new Date(o)
            labels.push(this.datepipe.transform(date, 'HH:mm','-0600'));
          }
          let times = [];
          for (var q of Object.keys(this.queue.dataPeople)) {
            const date = new Date(q)
            times.push(this.datepipe.transform(date, "HH:mm", '-0600'));
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
            const datasetsLow = [], datasetsMed = [], datasetsHigh = [], datasetsPall = []
            for(let i = 0; i < this.queue.dataAlertsLow.length; i++){
              datasetsLow.push({
                label: `Fila: ${i + 1}`,
                data: Object.values(this.queue.dataAlertsLow[i]),
                borderColor: cols[i],
                backgroundColor: cols[i],
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              })
              datasetsMed.push({
                label: `Fila: ${i + 1}`,
                data: Object.values(this.queue.dataAlertsMed[i]),
                borderColor: cols[i],
                backgroundColor: cols[i],
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              })
              datasetsHigh.push({
                label: `Fila: ${i + 1}`,
                data: Object.values(this.queue.dataAlertsHigh[i]),
                borderColor: cols[i],
                backgroundColor: cols[i],
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
              })
            }
            for(let i = 0; i < this.queue.dataPeopleAll.length; i++){
              datasetsPall.push({
                label: `Fila: ${i + 1}`,
                data: Object.values(this.queue.dataPeopleAll[i]),
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
              datasets: datasetsPall
            };
            this.options = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: true,
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
                    display: true,
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
                      display: false,
                      labelString: "Value",
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
          this.avgss = []
        }
      )
  }
  got(id){
    this.route.navigate([`/pages/tickets`])
  }
  goToLink(url: string){
    window.open(url, "_blank");
  }

  csvAlerts: Object = {
    alerts: false,
    count: false
  }
  showAlert: boolean = false;
  showData: boolean = false;

 async csv(algo){
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
        const ws = utils.json_to_sheet(res['data']);
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
        title: 'Imagen',
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
        title: 'Hora',
        type: 'string',
        filter: false
      },  
      camera_name: {
        title: 'Camara',
        type: 'string',
        filter: false
      },  
      zone: {
        title: 'Fila',
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

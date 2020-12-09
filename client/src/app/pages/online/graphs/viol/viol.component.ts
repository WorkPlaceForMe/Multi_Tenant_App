import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbColorHelper, NbThemeService, NbWindowService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { VideoComponent } from '../video/video.component';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { Account } from '../../../../models/Account';
=======

>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339

@Component({
  selector: 'ngx-viol',
  templateUrl: './viol.component.html',
  styleUrls: ['./viol.component.scss']
})
export class ViolComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  violence: any = [];
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

  ngOnInit(): void {
<<<<<<< HEAD
    if(api.length <= 1){
=======
    if(api.length <= 4){
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
      setTimeout(()=>{
        this.face.camera({id: this.camera}).subscribe(
          res =>{
            this.player = new JSMpeg.Player(`ws://localhost:${res['port']}`, {
              canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
            })
          },
          err=> console.error(err)
        )
      },500)
    }
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    var time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0,3);
    this.timezone = parseInt(this.timezone) * 2;
    let p = ''
    if(this.timezone > 0){
      p = '+'
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
<<<<<<< HEAD
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
      this.serv.violence(this.camera,l).subscribe(
        res=>{
          this.violence = res['data']
          for(var m of this.violence.raw){
            m['picture']  = api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/violence/' + m['cam_id'] + '/' +m['clip_path']
=======
      this.serv.violence(this.camera,this.range).subscribe(
        res=>{
          this.violence = res['data']
          for(var m of this.violence.raw){
            m['picture']  = api + "/pictures/" + this.now_user['id_account']+'/' + this.now_user['id_branch']+'/violence/' + this.camera+ '/' + m['clip_path']
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', this.timezone)
            switch(m['severity']){
              case '0':{
                m['severity'] = 'Low';
                break;
              }
              case '1':{
                m['severity'] = 'Mid';
                break;
              }
              case '2':{
                m['severity'] = 'High';
                break;
              }
            }
          }
          this.source = this.violence.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))
          let labels = []
          for(var o of Object.keys(this.violence.over)){
            o = o + ':00:00'
            labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm', this.timezone))
          }

          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.dataL = {
              labels: labels,
              datasets: [{
                label: 'Violence Over Time',
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.violence.over),
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
        err => console.error(err)
      )

  }
  got(id){
<<<<<<< HEAD
    this.route.navigate([`/pages/tickets`])
=======
    this.route.navigateByUrl(`/pages/tickets/view/${id.data.id}`)
>>>>>>> 8e3f7f53d9979c5d6b3c340b06e35cbbf02b6339
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
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
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
      severity: {
        title: 'Severity',
        type: 'string',
        filter: false
      }
    },
  };

}



@Component({
  selector: 'button-view',
  template: `
    <button class='btn btn-primary btn-block' (click)="openWindowForm()"><i class="fas fa-play-circle"></i></button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor(private windowService: NbWindowService){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openWindowForm() {
    window.open(this.rowData.picture, "_blank");
  }

  openWindowForm1() {
    this.windowService.open(VideoComponent, { title: `Video clip at: ${this.rowData.time}`, context: { path: this.rowData.picture}});
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}
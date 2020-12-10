import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbThemeService } from '@nebular/theme';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import { Account } from '../../../../models/Account';

@Component({
  selector: 'ngx-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

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
  ) {}

  themeSubscription: any;
  vehicle: any;
  dataL2: any;
  optionsL2: any;
  dataL: any;
  optionsL: any;
  dataH2: any;
  optionsH2: any;
  dataH: any;
  optionsH: any;
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

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    // if(api.length <= 4){
    //   setTimeout(()=>{
    //     this.face.camera({id: this.camera}).subscribe(
    //       res =>{
    //         this.player = new JSMpeg.Player(`ws://localhost:${res['port']}`, {
    //           canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
    //         })
    //       },
    //       err=> console.error(err)
    //     )
    //   },1500)
    // }
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
    this.serv.vehicle(this.camera,l).subscribe(
      res=>{
        this.vehicle = res['data']
        for(var m of this.vehicle.raw){
          m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + this.now_user['id_branch']+'/vehicle/' + this.camera+ '/' + m['picture'])
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', this.timezone)
        }
        if(Object.keys(this.vehicle.histogramEn).length != 0){
          let labels = []
          for(var o of Object.keys(this.vehicle.histogramEn)){
            o = o + ':00:00'
            labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm', this.timezone))
          }
          let times = []
          for(var q of this.vehicle.label){
            times.push(this.datepipe.transform(q, 'yyyy-M-dd HH:mm', this.timezone))
          }

          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.dataL = {
              labels: times,
              datasets: [{
                label: 'Vehicle Count Inside',
                data: this.vehicle.dataIn,
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                fill: false,
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

            this.dataL2 = {
              labels: times,
              datasets: [{
                label: 'Vehicle Count Entering',
                data: this.vehicle.dataEn,
                borderColor: colors.success,
                backgroundColor: colors.success,
                fill: false,
                // borderDash: [2, 2],
                pointRadius: 2,
                pointHoverRadius: 5,
              },
              {
                label: 'Vehicle Count Exiting',
                data: this.vehicle.dataEx,
                borderColor: colors.danger,
                backgroundColor: colors.danger,
                fill: false,
                // borderDash: [2, 2],
                pointRadius: 2,
                pointHoverRadius: 5,
              }],
            };
      
            this.optionsL2 = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {

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

            this.dataH = {
              labels: labels,
              datasets: [{
                  label: 'Entries',
                  backgroundColor: colors.success,
                  borderWidth: 1,
                  data: Object.values(this.vehicle.histogramEn),
                },
                {
                  label: 'Exits',
                  backgroundColor: colors.danger,
                  borderWidth: 1,
                  data: Object.values(this.vehicle.histogramEx),
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
                display:true,
                position: 'bottom',
                labels: {
                  fontColor: chartjs.textColor,
                },
              }
            };

          });
        }
      },
      err => console.error(err)
    )
  }

}

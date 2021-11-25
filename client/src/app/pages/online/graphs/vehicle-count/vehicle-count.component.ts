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
  selector: 'ngx-vehicle-count',
  templateUrl: './vehicle-count.component.html',
  styleUrls: ['./vehicle-count.component.scss', '../smart-table.scss']
})

export class VehicleCountComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  vcount: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};
  optionsBPre: any = {};

  @ViewChild('streaming', { static: false }) streamingcanvas: ElementRef;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router,
    private theme: NbThemeService,
  ) { }
  single: any;
  colorScheme: any;
  source: any = new LocalDataSource();
  carsData: any;
  trucksData: any;
  busesData: any;
  rickshawsData: any;
  motorbikesData: any;
  rtspIn: any;
  dataVehicles: any;

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
    this.face.checkVideo(26, this.camera).subscribe(
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
    this.serv.vcount(this.camera, l).subscribe(
      res => {
        this.vcount = res['data'];
        console.log(this.vcount)
        for (const m of this.vcount.raw) {
          m['picture'] = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/vcount/' + m['cam_id'] + '/' + m['picture']);
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss');
        }
        this.source = this.vcount.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));

        const carsTimes = [];
        const labels = [];
        for (const t of this.vcount.labels){
          labels.push(this.datepipe.transform(t, 'yyyy-M-dd HH:mm'));
        }

        // for (const c of this.vcount.carsLabel){
        //   carsTimes.push(this.datepipe.transform(c, 'yyyy-M-dd HH:mm'));
        // }

        // const busesTimes = [];
        // for (const b of this.vcount.busesLabel){
        //   busesTimes.push(this.datepipe.transform(b, 'yyyy-M-dd HH:mm'));
        // }

        // const trucksTimes = [];
        // for (const t of this.vcount.trucksLabel){
        //   trucksTimes.push(this.datepipe.transform(t, 'yyyy-M-dd HH:mm'));
        // }

        // const rickshawsTimes = [];
        // for (const r of this.vcount.rickshawsLabel){
        //   rickshawsTimes.push(this.datepipe.transform(r, 'yyyy-M-dd HH:mm'));
        // }

        // const motorbikesTimes = [];
        // for (const m of this.vcount.motorbikesLabel){
        //   motorbikesTimes.push(this.datepipe.transform(m, 'yyyy-M-dd HH:mm'));
        // }

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;

              this.optionsBPre = {
              maintainAspectRatio: true,
              responsive: true,
              legend: {
                labels: {
                  fontColor: chartjs.textColor,
                },
              },
              scales: {
                xAxes: [
                  {
                    stacked: true,
                    gridLines: {
                      display: false,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
                yAxes: [
                  {
                    stacked: true,
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

          this.options = {
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
          this.dataVehicles = {
            labels: labels,
            datasets: [{
              label: 'Cars',
              data: this.vcount.carsLabel,
              borderColor: colors.success,
              backgroundColor: colors.success,
              fill: false,
              // borderDash: [2, 2],
              pointRadius: 2,
              pointHoverRadius: 5,
            },
            {
              label: 'Buses',
              data: this.vcount.busesLabel,
              borderColor: colors.danger,
              backgroundColor: colors.danger,
              fill: false,
              // borderDash: [2, 2],
              pointRadius: 2,
              pointHoverRadius: 5,
            },
            {
              label: 'Motorbikes',
              data: this.vcount.motorbikesLabel,
              borderColor: colors.warning,
              backgroundColor: colors.warning,
              fill: false,
              // borderDash: [2, 2],
              pointRadius: 2,
              pointHoverRadius: 5,
            },
            {
              label: 'Trucks',
              data: this.vcount.trucksLabel,
              borderColor: colors.info,
              backgroundColor: colors.info,
              fill: false,
              // borderDash: [2, 2],
              pointRadius: 2,
              pointHoverRadius: 5,
            }],
          };
          // this.carsData = {
          //   labels: carsTimes,
          //   datasets: [{
          //     label: 'Cars Count Entering',
          //     data: this.vcount.carsEn,
          //     borderColor: colors.success,
          //     backgroundColor: colors.success,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   },
          //   {
          //     label: 'Cars Count Exiting',
          //     data: this.vcount.carsEx,
          //     borderColor: colors.danger,
          //     backgroundColor: colors.danger,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   }],
          // };
          // this.busesData = {
          //   labels: busesTimes,
          //   datasets: [{
          //     label: 'Buses Count Entering',
          //     data: this.vcount.busesEn,
          //     borderColor: colors.success,
          //     backgroundColor: colors.success,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   },
          //   {
          //     label: 'Buses Count Exiting',
          //     data: this.vcount.busesEx,
          //     borderColor: colors.danger,
          //     backgroundColor: colors.danger,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   }],
          // };
          // this.trucksData = {
          //   labels: trucksTimes,
          //   datasets: [{
          //     label: 'Trucks Count Entering',
          //     data: this.vcount.trucksEn,
          //     borderColor: colors.success,
          //     backgroundColor: colors.success,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   },
          //   {
          //     label: 'Trucks Count Exiting',
          //     data: this.vcount.trucksEx,
          //     borderColor: colors.danger,
          //     backgroundColor: colors.danger,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   }],
          // };
          // this.rickshawsData = {
          //   labels: rickshawsTimes,
          //   datasets: [{
          //     label: 'Rickshaws Count Entering',
          //     data: this.vcount.rickshawsEn,
          //     borderColor: colors.success,
          //     backgroundColor: colors.success,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   },
          //   {
          //     label: 'Rickshaws Count Exiting',
          //     data: this.vcount.rickshawsEx,
          //     borderColor: colors.danger,
          //     backgroundColor: colors.danger,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   }],
          // };
          // this.motorbikesData = {
          //   labels: motorbikesTimes,
          //   datasets: [{
          //     label: 'Motorbikes Count Entering',
          //     data: this.vcount.motorbikesEn,
          //     borderColor: colors.success,
          //     backgroundColor: colors.success,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   },
          //   {
          //     label: 'Motorbikes Count Exiting',
          //     data: this.vcount.motorbikesEx,
          //     borderColor: colors.danger,
          //     backgroundColor: colors.danger,
          //     fill: false,
          //     // borderDash: [2, 2],
          //     pointRadius: 2,
          //     pointHoverRadius: 5,
          //   }],
          // };
        });
      },
      err => {
        console.error(err);
        this.vcount = undefined;
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
      /* picture: {
        title: 'PHOTO',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      }, */
      time: {
        title: 'TIME',
        type: 'string',
        filter: false,
      },
      car_numbers: {
        title: 'CAR COUNT',
        type: 'string',
        filter: false,
      },
      motorbike_numbers: {
        title: 'MOTORBIKE COUNT',
        type: 'string',
        filter: false,
      },
      truck_numbers: {
        title: 'TRUCK COUNT',
        type: 'string',
        filter: false,
      },
      bus_numbers: {
        title: 'BUS COUNT',
        type: 'string',
        filter: false,
      },
      camera_name: {
        title: 'CAM',
        type: 'string',
        filter: false,
      },
    },
  };

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


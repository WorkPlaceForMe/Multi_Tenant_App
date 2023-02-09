import { DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NbCalendarRange, NbColorHelper, NbThemeService } from "@nebular/theme";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { api } from "../../../../models/API";
import { AnalyticsService } from "../../../../services/analytics.service";
import { FacesService } from "../../../../services/faces.service";
import { Account } from "../../../../models/Account";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup } from "@angular/forms";
import { utils, writeFileXLSX } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'ngx-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit, OnDestroy {
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  availability: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};
  imageUrl: any;
  dialogRef: NbDialogRef<any>;
  @ViewChild("streaming", { static: false }) streamingcanvas: ElementRef;
  canvas: any;
  context: any;
  data: any;
  manualTriggerForm: FormGroup;
  algorithms: any;
  loading: boolean = false;
  loadingTakeScreenShot: boolean = false;
  algoId = 69;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private theme: NbThemeService,
  ) {}
  single: any;
  colorScheme: any;
  source: any = new LocalDataSource();
  dataL: any;
  optionsL: any;
  count: number = 0;
  coords = [];

  ngOnDestroy() {
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  videoFile: string = "";

  video: boolean = false;
  rtspIn: any;

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
    var time = new Date();
    this.timezone = time
      .toString()
      .match(/[\+,\-](\d{4})\s/g)[0]
      .split(" ")[0]
      .slice(0, 3);
    this.timezone = parseInt(this.timezone);
    let p = "";
    if (this.timezone > 0) {
      p = "+";
    }
    this.timezone = p + JSON.stringify(this.timezone) + "00";
    let type;
    if (this.now_user.id_branch != "0000") {
      type = "cam_id";
    } else {
      type = "id_account";
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type,
      timezone: '-0300'
    };
    // this.algoId = 19;
    this.face.checkVideo(this.algoId, this.camera).subscribe(
      (res) => {
        this.video = res["video"];
        this.link = res["http_out"];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(
          res["http_out"]
        );
      },
      (err) => console.error(err)
    );
    this.serv.availability(this.camera, l).subscribe(
      (res) => {
        this.availability = res["data"];
        const times = [];
        for (const q of this.availability.labelsDAll[0]){
          // times.push(new Date(q))
          times.push(this.datepipe.transform(q, 'HH:mm', '-0300'));
        }
        for(let m of this.availability.rawAlerts){
          m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/avail_alerts/' + m['cam_id'] + '/' + m['picture'])
          m['clip_path']  = api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/avail_alerts/' + m['cam_id'] + '/' + m['clip_path']
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss','-0300')
          m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/avail_alerts/' + m['cam_id'] + '/' + m['movie']);
          m['alert'] = ''
        }
        const source = this.availability.rawAlerts
        this.source = source.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))

        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          const data = []
          const cols = {
            0: colors.primary,
            1: colors.warning,
            2: colors.success,
            3: colors.info,
            4: colors.danger
          }
          for(let i = 0; i < this.availability.dwellAll.length; i++){
            let label = 'None'
            if(i + 1 === 1){
              label = 'Marraqueta: '
            }else if (i + 1 === 2){
              label = 'Hallulla: '
            }
            data.push({
              label: `${label}`,
              data: Object.values(this.availability.dwellAll[i]),
              borderColor: cols[i],
              backgroundColor: cols[i],
              fill: false,
              pointRadius: 2,
              pointHoverRadius: 5,
            })
          }

          this.dataL = {
            labels: times,
            datasets: data,
          };

          this.optionsL = {
            spanGaps: true,
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
                  id: 'y-axis-1',
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
                    min: 0, 
                    max:100,
                    beginAtZero: true,
                  },
                },
              ],
            },
          };
        });
      },
      (err) => console.error(err)
    );
  }

  // downloadFile() {
  //   const url = `${environment.baseURL}/file/downloadfile?parameter1=${JSON.stringify(param1)}&parameter2=${JSON.stringify(param2)}`;
  //   this.apiService.downloadLargeFile(url).then(
  //       res => {
  //         const filename = `file_download_${datetimestamp}.csv`;
  //          let blob = new Blob([res],{type:'text/csv'});             saveAs(blob, filename);
  //       },
  //       err => {
  //         alert("Error while downloading the file.");
  //         console.error(err);
  //       }
  //     );
  //   }

  //   async downloadLargeFile(url:string,body:any): Promise<ArrayBuffer> {
  //     return await this.http.post(url, body, {
  //        responseType: "arraybuffer",
  //      }).pipe(map((file:ArrayBuffer) => {
  //    return file;
  //    })).toPromise
  //    }

  goToLink(url: string){
    window.open(url, "_blank");
  }

  pass(vid:string){
    this.videoplayer.nativeElement.src = vid    
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();

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
    noDataMessage: "No se a encontrado data",
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
        title: 'Zona',
        type: 'string',
        filter: false,
        valuePrepareFunction: (zone) => {
          if(zone == 0){
            return 'Marraqueta'
          }else if(zone == 1){
            return 'Hallulla'
          }
        }
      },  
      alert: {
        title: 'Alerta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (alert) => {
          return 'Menos de 15%'
        }
      }
    },
  };

  showAlert: boolean = false;
  showData: boolean = false;
  csvAlerts: Object = {
    alerts: false,
    data: false
  }

  async csv(typ){
    this.csvAlerts[typ] = true
    this.showData = false;
    this.showAlert = false;
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
      typ: typ,
      algo: this.algoId
    }
    ;(await this.serv.report1(this.algoId, this.camera, l)).subscribe(
      async (res) => {
        const ws = utils.json_to_sheet(res['data']);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        await writeFileXLSX(wb, `${uuidv4()}.xlsx`);
        this.csvAlerts[typ] = false
      },
      err => {
        console.error(err)
        this.csvAlerts[typ] = false
        if(typ === 'data'){
          this.showData = true;
        }
        if(typ === 'alerts'){
          this.showAlert = true;
        }
      }
    )
  }

  link: string;
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
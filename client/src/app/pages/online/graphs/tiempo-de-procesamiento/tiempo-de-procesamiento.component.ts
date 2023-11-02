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
import { Router } from "@angular/router";
import { Account } from "../../../../models/Account";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup } from "@angular/forms";
import { WindowOpenerComponent } from "../window-opener/window-opener.component";
import { number } from "echarts";

@Component({
  selector: 'ngx-tiempo-de-procesamiento',
  templateUrl: './tiempo-de-procesamiento.component.html',
  styleUrls: ['./tiempo-de-procesamiento.component.scss']
})
export class TiempoDeProcesamientoComponent implements OnInit , OnDestroy {
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  tiempo: any = [];
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
  algoId = 74;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private theme: NbThemeService,
    private route: Router,
  ) {}
  single: any;
  colorScheme: any;
  source: any = new LocalDataSource();
  dataL: any;
  optionsL: any;
  count: number = 0;
  coords = [];
  zonesData: any[] = [];
  uniczones:any;
  meatcount:number;
  resultdata:any;
  dwellcount:number;
  helmetzones:number;
  // helmetcountzones:number;
  dwellzones:any;
  ngOnDestroy() {
    if (this.player != undefined) {
      this.player.destroy();
      this.face.cameraStop({ id: this.camera }).subscribe(
        (res) => {},
        (err) => console.error(err)
      );
    }
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  videoFile: string = "";

  video: boolean = false;
  rtspIn: any;

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    // var time = new Date();
    // this.timezone = time
    //   .toString()
    //   .match(/[\+,\-](\d{4})\s/g)[0]
    //   .split(" ")[0]
    //   .slice(0, 3);
    // this.timezone = parseInt(this.timezone);
    // let p = "";
    // if (this.timezone > 0) {
    //   p = "+";
    // }
    // this.timezone = p + JSON.stringify(this.timezone) + "00";
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
    this.serv.tiempo(this.camera, l).subscribe(
      (res) => {
        this.tiempo = res["data"];
        this.zonesData = res["data"].array; // Assign the zonesData from the API response
        this.resultdata=res['data'].raw;
        this.dwellcount=res['data'].dwellzones;
        this.uniczones=res['data'].uniczones;
        this.helmetzones=res['data'].helmetzone;
        // this.helmetcountzones=res['data'].hcount;
        this.dwellzones=res['data'].dwellzones;
        var length = this.uniczones.length;
        this.meatcount=res['data'].count;
         

        for (var m of this.tiempo.raw) {
          m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/tiempo/' + m['cam_id'] + '/' + m['movie']);
          m["picture"] = this.sanitizer.bypassSecurityTrustUrl(
            api +
              "/pictures/" +
              this.now_user["id_account"] +
              "/" +
              m["id_branch"] +
              "/meats/" +
              m["cam_id"] +
              "/" +
              m["id"] + '.jpg'
          );
          console.log(m.id,'ididididididid')
          m["clip_path"] =
            api +
            "/pictures/" +
            this.now_user["id_account"] +
            "/" +
            m["id_branch"] +
            "/tiempo/" +
            m["cam_id"] +
            "/" +
           m["id"] + '.jpg'
          m["time"] = this.datepipe.transform(m["time"], "yyyy-M-dd HH:mm:ss",this.timezone);
          switch (m["severity"]) {
            case "0": {
              m["severity"] = "Low";
              break;
            }
            case "1": {
              m["severity"] = "Mid";
              break;
            }
            case "2": {
              m["severity"] = "High";
              break;
            }
          }
        }
        this.source = this.tiempo.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
        let labels = [];

        for (var o of Object.keys(this.tiempo.over)) {
          o = o + ":00:00";
          labels.push(this.datepipe.transform(o, "yyyy-M-dd HH:mm",this.timezone));
        }

        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;

          this.dataL = {
            labels: labels,
            datasets: [
              {
                label: "Carnes en el tiempo",
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.tiempo.over),
                borderColor: colors.primary,
              },
            ],
          };

          this.optionsL = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false,
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
                    display: false,
                    labelString: "Value",
                  },
                  gridLines: {
                    display: true,
                    color: chartjs.axisLineColor,
                  },
                    ticks: {
                      fontColor: chartjs.textColor,
                      beginAtZero: true,
                      stepSize: 1
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

  getAlgorithms() {
    this.face.getAllAlgos().subscribe(
      (res: any) => {
        this.algorithms = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  link: string;

  got(id) {
    this.route.navigate([`/pages/tickets`]);
  }

  pass(vid: string) {
    this.videoplayer.nativeElement.src = vid;
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();
  }
  settings = {
    mode: "external",
    actions: false,
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: "No data found",
    columns: {
      picture: {
        title: "Imagen",
        type: "custom",
        filter: false,
        renderComponent: ButtonViewComponentPic,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {});
        },
      },
      // movie: {
      //   title: 'VIDEO',
      //   type: 'custom',
      //   filter: false,
      //   renderComponent: WindowOpenerComponent,
      //   onComponentInitFunction(instance) {
      //     instance.save.subscribe(row => {
      //       alert(`${row.name} saved!`);
      //     });
      //   },
      // },
      time: {
        title: "Hora",
        type: "string",
        filter: false,
      },
      type: {
        title: "Tipo",
        type: "string",
        filter: false,
      },
      cam_name: {
        title: "Camara",
        type: "string",
        filter: false,
      },
    },
  };
}

@Component({
  selector: "button-view",
  template: ` <img [src]="rowData.picture" width="60" height="60" /> `,
})
export class ButtonViewComponentPic implements ViewCell, OnInit {
  constructor() {}

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}
}

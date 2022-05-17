import { DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  NbCalendarRange,
  NbDialogRef,
  NbDialogService,
  NbThemeService,
} from "@nebular/theme";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { api } from "../../../../models/API";
import { Account } from "../../../../models/Account";
import { AnalyticsService } from "../../../../services/analytics.service";
import { DomSanitizer } from "@angular/platform-browser";
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { FacesService } from "../../../../services/faces.service";
import { ManualTriggerComponent } from "../manual-trigger/manual-trigger.component";
import { ip } from "../../../../models/IpServer";
import { Router } from "@angular/router";
import { ViewManualTriggerComponent } from "../view-manual-trigger/view-manual-trigger.component";

@Component({
  selector: "ngx-pc",
  templateUrl: "./pc.component.html",
  styleUrls: ["./pc.component.scss"],
})
export class PcComponent implements OnInit, OnDestroy {
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  timezone: any;
  now_user: Account;
  dialogRef: NbDialogRef<any>;
  data: any;
  algoId = 12;
  constructor(
    private serv: AnalyticsService,
    private theme: NbThemeService,
    public datepipe: DatePipe,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    private dialogService: NbDialogService,
    private route: Router
  ) {}

  themeSubscription: any;
  pc: any;
  dataL2: any;
  optionsL2: any;
  dataL: any;
  optionsL: any;
  dataH2: any;
  optionsH2: any;
  dataH: any;
  optionsH: any;
  player: any;
  rtspIn: any;
  loadingTakeScreenShot: boolean = false;
  source: any = new LocalDataSource();

  @ViewChild("streaming", { static: false }) streamingcanvas: ElementRef;

  ngOnDestroy() {
    if (this.player != undefined) {
      this.player.destroy();
      this.face.cameraStop({ id: this.camera }).subscribe(
        (res) => {},
        (err) => console.error(err)
      );
    }
  }

  ngOnInit(): void {
    this.getManualTriggers();
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
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
    this.timezone = time
      .toString()
      .match(/[\+,\-](\d{4})\s/g)[0]
      .split(" ")[0]
      .slice(0, 3);
    let aaa = this.timezone;
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
    };
    //  this.algoId = 12;
    this.face.checkVideo(this.algoId, this.camera).subscribe(
      (res) => {
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(
          res["http_out"]
        );
      },
      (err) => console.error(err)
    );
    this.serv.pc(this.camera, l).subscribe(
      (res) => {
        this.pc = res["data"];
        for (var m of this.pc.raw) {
          m["picture"] = this.sanitizer.bypassSecurityTrustUrl(
            api +
              "/pictures/" +
              this.now_user["id_account"] +
              "/" +
              this.now_user["id_branch"] +
              "/pc/" +
              this.camera +
              "/" +
              m["picture"]
          );
          m["time"] = this.datepipe.transform(m["time"], "yyyy-M-dd HH:mm:ss");
        }
        let labels = [];
        // for(var o of Object.keys(this.pc.histogramEn)){
        //   o = o + ':00:00'
        //   labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm'))
        // }
        this.source = this.pc.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
        let times = [];
        for (var q of this.pc.label) {
          times.push(this.datepipe.transform(q, "yyyy-M-dd HH:mm"));
        }

        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;

          this.dataL = {
            labels: times,
            datasets: [
              {
                label: "People Count Inside",
                data: this.pc.dataIn,
                borderColor: colors.primary,
                backgroundColor: colors.primary,
                fill: false,
                pointRadius: 2,
                pointHoverRadius: 5,
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
                  },
                },
              ],
            },
          };

          this.dataL2 = {
            labels: times,
            datasets: [
              {
                label: "People Count Entering",
                data: this.pc.dataEn,
                borderColor: colors.success,
                backgroundColor: colors.success,
                fill: false,
                // borderDash: [2, 2],
                pointRadius: 2,
                pointHoverRadius: 5,
              },
              {
                label: "People Count Exiting",
                data: this.pc.dataEx,
                borderColor: colors.danger,
                backgroundColor: colors.danger,
                fill: false,
                // borderDash: [2, 2],
                pointRadius: 2,
                pointHoverRadius: 5,
              },
            ],
          };

          this.optionsL2 = {
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

          this.dataH = {
            labels: labels,
            datasets: [
              {
                label: "Entries",
                backgroundColor: colors.success,
                borderWidth: 1,
                data: Object.values(this.pc.histogramEn),
              },
              {
                label: "Exits",
                backgroundColor: colors.danger,
                borderWidth: 1,
                data: Object.values(this.pc.histogramEx),
              },
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
            legend: {
              display: true,
              position: "bottom",
              labels: {
                fontColor: chartjs.textColor,
              },
            },
          };
        });
      },
      (err) => console.error(err)
    );
  }

  getManualTriggers() {
    const manualTriggers = [];
    this.face.getmanualTriggers().subscribe(
      (res: any) => {
        for (const manualTrigger of res["manualTriggers"]) {
          const obj = {
            time: this.datepipe.transform(
              manualTrigger.createdAt,
              "yyyy-M-dd HH:mm:ss"
            ),
            severity: manualTrigger.severity,
            camera_name: manualTrigger.camera.name,
            picture: manualTrigger.http_in,
            actions: manualTrigger.actions,
            status: manualTrigger.triggered,
            results: manualTrigger.results,
            canvasHeight: manualTrigger.canvasHeight,
            canvasWidth: manualTrigger.canvasWidth,
          };
          manualTriggers.push(obj);
        }
        this.source.load(
          manualTriggers
            .slice()
            .sort((a, b) => +new Date(b.time) - +new Date(a.time))
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openFormModal() {
    this.loadingTakeScreenShot = true;
    this.face.getCamera(this.camera).subscribe(
      (res: any) => {
        this.loadingTakeScreenShot = false;
        const serverIp = ip === "localhost" ? "40.84.143.162" : ip;
        this.data = {
          screenshot: `http://${serverIp}${res["data"]["heatmap_pic"]}`,
          results: [],
          cameraId: this.camera,
          algoId: this.algoId,
        };

        this.dialogRef = this.dialogService.open<any>(ManualTriggerComponent, {
          context: { data: this.data },
          hasScroll: true,
          dialogClass: "model-full",
        });

        this.dialogRef.onClose.subscribe((resp) => {
          console.log(resp);
          this.getManualTriggers();
        });
      },
      (error) => {
        this.loadingTakeScreenShot = false;
        alert("There have some problem to take screenshot");
        console.log(error);
      }
    );
  }

  got() {
    this.route.navigate([`/pages/tickets`]);
  }

  settings = {
    mode: "external",
    // actions: {
    //   position: "right",
    //   columnTitle: "ACTIONS",
    //   add: false,
    //   edit: true,
    //   delete: false,
    // },
    // edit: {
    //   editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    //   confirmSave: true,
    // },
    actions: false,
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: "No data found",
    columns: {
      picture: {
        title: "PICTURE",
        type: "custom",
        filter: false,
        renderComponent: ButtonViewComponentPic,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {});
        },
      },
      time: {
        title: "TIME",
        type: "string",
        filter: false,
      },
      number_of_ppl: {
        title: "PEOPLE",
        type: "string",
        filter: false,
      },
      camera_name: {
        title: "CAM",
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

@Component({
  selector: "button-view",
  styles: [
    ".play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}",
  ],
  template: `
    <div>
      <div style="width:60px; height: 60px">
        <img [src]="rowData.picture" width="60" height="60" />
        <button class="btn btn-link play-btn" (click)="openVideo()">
          <i class="fas fa-play"></i>
        </button>
      </div>
    </div>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor() {}

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openVideo() {
    this.save.emit(this.rowData.clip_path);
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}

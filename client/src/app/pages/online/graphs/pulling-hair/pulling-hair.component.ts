import { DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ip } from "../../../../models/IpServer";
import { ViewManualTriggerComponent } from "../view-manual-trigger/view-manual-trigger.component";

@Component({
  selector: "ngx-pulling-hair",
  templateUrl: "./pulling-hair.component.html",
  styleUrls: ["./pulling-hair.component.scss"],
})
export class PullingHairComponent implements OnInit, OnDestroy {
  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  pullingHair: any = [];
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
  algoId = 40;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private theme: NbThemeService,
    private route: Router,
    private dialogService: NbDialogService,
    private rd: Renderer2,
    private fb: FormBuilder
  ) {}
  single: any;
  colorScheme: any;
  source: any = new LocalDataSource();
  dataL: any;
  optionsL: any;
  count: number = 0;
  coords = [];

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
    this.getManualTriggers();
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
    };
    // this.algoId = 19;
    this.face.checkVideo(this.algoId, this.camera).subscribe(
      (res) => {
        this.video = res["video"];
        this.link = res["http_out"];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(
          res["http_out"]
        );
        if (this.video === true) {
          this.settings["columns"]["picture"] = {
            title: "VIDEO",
            type: "custom",
            filter: false,
            renderComponent: ButtonViewComponent,
            onComponentInitFunction: (instance) => {
              instance.save.subscribe((row: string) => {
                this.pass(row);
              });
            },
          };
          this.settings = Object.assign({}, this.settings);
        }
      },
      (err) => console.error(err)
    );
    this.serv.pullingHair(this.camera, l).subscribe(
      (res) => {
        this.pullingHair = res["data"];
        for (var m of this.pullingHair.raw) {
          m["picture"] = this.sanitizer.bypassSecurityTrustUrl(
            api +
              "/pictures/" +
              this.now_user["id_account"] +
              "/" +
              m["id_branch"] +
              "/pulling_hair/" +
              m["cam_id"] +
              "/" +
              m["picture"]
          );
          m["clip_path"] =
            api +
            "/pictures/" +
            this.now_user["id_account"] +
            "/" +
            m["id_branch"] +
            "/pulling_hair/" +
            m["cam_id"] +
            "/" +
            m["clip_path"];
          m["time"] = this.datepipe.transform(m["time"], "yyyy-M-dd HH:mm:ss");
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
        this.source = this.pullingHair.raw
          .slice()
          .sort((a, b) => +new Date(b.time) - +new Date(a.time));
        let labels = [];
        for (var o of Object.keys(this.pullingHair.over)) {
          o = o + ":00:00";
          labels.push(this.datepipe.transform(o, "yyyy-M-dd HH:mm"));
        }

        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;

          this.dataL = {
            labels: labels,
            datasets: [
              {
                label: "Hands Over Time",
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.pullingHair.over),
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

  initializeManualTriggerForm() {
    this.manualTriggerForm = this.fb.group({
      actions: ["", [Validators.required, Validators.minLength(3)]],
      severity: ["", [Validators.required, Validators.minLength(3)]],
      algoId: ["", [Validators.required]],
    });
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    let x, y, rect;
    if (this.canvas) {
      rect = this.canvas.getBoundingClientRect();
      x = e.clientX - rect.left - 3;
      y = e.clientY - rect.top - 3;
      if (this.count == 1) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.re_draw();
        this.context.fillStyle = "rgba(0,0,0,0)";
        this.context.strokeStyle = "white";
        this.context.fillRect(
          this.coords[0]["x"] - 2,
          this.coords[0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(this.coords[0]["x"] - 2, y - 2, 4, 4);
        this.context.fillRect(x - 2, this.coords[0]["y"] - 2, 4, 4);
        this.context.strokeRect(
          this.coords[0]["x"],
          this.coords[0]["y"],
          x - this.coords[0]["x"],
          y - this.coords[0]["y"]
        );
        this.context.fillRect(
          this.coords[0]["x"],
          this.coords[0]["y"],
          x - this.coords[0]["x"],
          y - this.coords[0]["y"]
        );
        this.context.fillRect(x - 2, y - 2, 4, 4);
        this.context.lineWidth = 2.5;
        this.context.stroke();
      }
    }
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
  openFormModal(template: any) {
    this.loadingTakeScreenShot = true;
    this.face.screenshot({stream: this.link, id_account: this.now_user.id_account, id_branch: this.now_user.id_branch}).subscribe(
      res => {
        const screenShot = res['img']
        this.initializeManualTriggerForm();
        this.getAlgorithms();
        this.face.getCamera(this.camera).subscribe(
          (res: any) => {
            this.loadingTakeScreenShot = false;
            this.dialogRef = this.dialogService.open(template, {
              hasScroll: true,
              dialogClass: "model-full",
            });
            this.canvas = <HTMLCanvasElement>document.getElementById("canvasId");
            this.context = this.canvas.getContext("2d");
            this.context.canvas.width = 700;
            this.context.canvas.height = 400;
            const serverIp = ip === "localhost" ? "40.84.143.162" : ip;
            this.data = {
              screenshot: `${screenShot}`,
              results: [],
            };
          },
          (error) => {
            this.loadingTakeScreenShot = false;
            console.log(error);
          }
        );
      },
      err => console.error(err)
    )
  }

  drawRect(event: any) {
    this.canvas = this.rd.selectRootElement(event.target);
    this.context = this.canvas.getContext("2d");
    this.goAnnotate(event);
  }

  clear() {
    this.context = this.canvas.getContext("2d");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.data["results"].splice(this.data["results"].length - 1, 1);
    this.re_draw();
  }

  getBackground() {
    const backgroundImage = `url(${this.data.screenshot})`;
    return this.sanitizer.bypassSecurityTrustStyle(backgroundImage);
  }

  goAnnotate(event) {
    this.re_draw();
    let x, y, rect;
    this.count++;
    if (this.count == 1) {
      this.context.beginPath();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw();
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      this.coords.push({ x: x, y: y });
      this.context.moveTo(x, y);
      this.context.fillRect(x - 2, y - 2, 4, 4);
    } else if (this.count == 2) {
      this.count = 0;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      this.context.fillRect(
        this.coords[0]["x"] - 2,
        this.coords[0]["y"] - 2,
        4,
        4
      );
      this.context.fillRect(this.coords[0]["x"] - 2, y - 2, 4, 4);
      this.context.fillRect(x - 2, this.coords[0]["y"] - 2, 4, 4);
      this.context.strokeStyle = "lime";
      this.context.strokeRect(
        this.coords[0]["x"],
        this.coords[0]["y"],
        x - this.coords[0]["x"],
        y - this.coords[0]["y"]
      );
      this.context.fillRect(x - 2, y - 2, 4, 4);
      x = x - this.coords[0].x;
      y = y - this.coords[0].y;
      this.coords.push({ x: x, y: y });
      this.coords.push({
        general_detection: "No",
        detection_source: "Manual Drawn",
      });
      this.context.lineWidth = 2.5;
      this.context.stroke();
      this.data["results"].push(this.coords);
      this.re_draw();
      this.coords = [];
    }
  }

  re_draw() {
    for (let e = 0; e < this.data["results"].length; e++) {
      this.context.strokeStyle = "lime";
      if (this.data["results"][e][2]["general_detection"] == "Yes") {
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][1]["x"] - 2,
          this.data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.strokeRect(
          this.data["results"][e][0]["x"],
          this.data["results"][e][0]["y"],
          this.data["results"][e][1]["x"] - this.data["results"][e][0]["x"],
          this.data["results"][e][1]["y"] - this.data["results"][e][0]["y"]
        );
        this.context.fillRect(
          this.data["results"][e][1]["x"] - 2,
          this.data["results"][e][1]["y"] - 2,
          4,
          4
        );
      } else {
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][0]["y"] - 2,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] + this.data["results"][e][1]["x"] - 4,
          this.data["results"][e][0]["y"] - 4,
          4,
          4
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] - 2,
          this.data["results"][e][0]["y"] + this.data["results"][e][1]["y"] - 2,
          4,
          4
        );
        this.context.strokeRect(
          this.data["results"][e][0]["x"],
          this.data["results"][e][0]["y"],
          this.data["results"][e][1]["x"],
          this.data["results"][e][1]["y"]
        );
        this.context.fillRect(
          this.data["results"][e][0]["x"] + this.data["results"][e][1]["x"] - 3,
          this.data["results"][e][0]["y"] + this.data["results"][e][1]["y"] - 3,
          4,
          4
        );
      }
      this.context.lineWidth = 2.5;
      this.context.stroke();
    }
  }

  saveManualTrigger() {
    this.loading = true;
    const reqData = {
      cameraId: this.camera,
      httpIn: this.data.screenshot,
      actions: this.manualTriggerForm.value.actions,
      severity: this.manualTriggerForm.value.severity,
      results:
        this.data.results.length > 0 ? JSON.stringify(this.data.results) : "",
      canvasWidth: String(this.context.canvas.width),
      canvasHeight: String(this.context.canvas.height),
      algoId: this.manualTriggerForm.value.algoId,
    };

    this.face.manualTrigger(reqData).subscribe(
      (res: any) => {
        this.loading = false;
        this.closeModal();
        this.getManualTriggers();
        alert(res.message);
      },
      (error) => {
        this.loading = false;
        console.log(error);
        alert(error.error.message);
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }

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
      camera_name: {
        title: "CAM",
        type: "string",
        filter: false,
      },
      severity: {
        title: "SEVERITY",
        type: "string",
        filter: false,
      },
      actions: {
        title: "ACTIONS",
        type: "string",
        filter: false,
      },
      status: {
        title: "STATUS",
        type: "string",
        filter: false,
      },
      button: {
        title: "IMAGE",
        type: "custom",
        valuePrepareFunction: (value, row, cell) => {
          return row;
        },
        renderComponent: ViewManualTriggerComponent,
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

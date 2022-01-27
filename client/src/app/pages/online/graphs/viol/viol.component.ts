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
import {
  NbCalendarRange,
  NbColorHelper,
  NbThemeService,
  NbWindowService,
} from "@nebular/theme";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { api } from "../../../../models/API";
import { AnalyticsService } from "../../../../services/analytics.service";
import { FacesService } from "../../../../services/faces.service";
import { Router } from "@angular/router";
import { Account } from "../../../../models/Account";
import { NbDialogRef, NbDialogService } from "@nebular/theme";
import { NgxCaptureService } from "ngx-capture";
import { tap } from "rxjs/operators";

@Component({
  selector: "ngx-viol",
  templateUrl: "./viol.component.html",
  styleUrls: ["./viol.component.scss", "../smart-table.scss"],
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
  imageUrl: any;
  dialogRef: NbDialogRef<any>;
  @ViewChild("streaming", { static: false }) streamingcanvas: ElementRef;
  @ViewChild("screen", { static: true }) screen: any;
  // @ViewChild("snapshot", { static: true }) snapshot: any;
  canvas: any;
  context: any;
  data: any;
  description: string = "";

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private theme: NbThemeService,
    private route: Router,
    private dialogService: NbDialogService,
    private rd: Renderer2,
    private captureService: NgxCaptureService
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
    this.face.checkVideo(19, this.camera).subscribe(
      (res) => {
        this.video = res["video"];

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
    this.serv.violence(this.camera, l).subscribe(
      (res) => {
        this.violence = res["data"];
        for (var m of this.violence.raw) {
          m["picture"] = this.sanitizer.bypassSecurityTrustUrl(
            api +
              "/pictures/" +
              this.now_user["id_account"] +
              "/" +
              m["id_branch"] +
              "/violence/" +
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
            "/violence/" +
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
        this.source = this.violence.raw
          .slice()
          .sort((a, b) => +new Date(b.time) - +new Date(a.time));
        let labels = [];
        for (var o of Object.keys(this.violence.over)) {
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
                label: "Violence Over Time",
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.violence.over),
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

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    let x, y, rect;
    if (this.canvas) {
      // console.log(e.clientX+','+e.clientY, this.click);
      rect = this.canvas.getBoundingClientRect();
      x = e.clientX - rect.left - 3;
      y = e.clientY - rect.top - 3;
      if (this.count == 1) {
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.re_draw();
        //  this.context.fillStyle = "white";
        this.context.fillStyle = "rgba(0,0,0,0)";
        this.context.strokeStyle = "white";

        //  this.context.strokeStyle = "rgba(0,0,0,0)";
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
        //  this.context.fillStyle = "rgba(255, 255, 255, 0.3)";
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

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  openFormModal1(template: any) {
    this.dialogRef = this.dialogService.open(template, {
      hasScroll: true,
      dialogClass: "model-full",
    });
    // this.canvas = <HTMLCanvasElement>document.getElementById("canvasId");
    // console.log(this.screen.nativeElement);

    // const video = document.getElementById("video");
    const video = this.screen.nativeElement;
    // video.setAttribute("crossOrigin", "Anonymous");
    //  const snapshot = this.snapshot.nativeElement;
    console.log(video);
    //  console.log(snapshot);

    //  const canvas = document.createElement("canvas");
    const canvas = <HTMLCanvasElement>document.getElementById("canvasId");
    const context = canvas.getContext("2d");
    // scale the canvas accordingly
    //  canvas.width = 400;
    //  canvas.height = 400;
    // draw the video at that frame
    context.drawImage(video, 0, 0, 480, 320);
    // convert it to a usable data URL
    const dataURL = canvas.toDataURL();
    console.log(dataURL);
    // const blob = canvas.toBlob();
    // console.log(blob);

    //  snapshot.src = dataURL;

    // const file = this.DataURIToBlob(dataURL);
    // console.log(file);
    // this.face.saveSnapshot(file).subscribe(
    //   (res: any) => {
    //     console.log(res);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  openFormModal(template: any) {
    this.dialogRef = this.dialogService.open(template, {
      hasScroll: true,
      dialogClass: "model-full",
    });
    this.canvas = <HTMLCanvasElement>document.getElementById("canvasId");
    this.context = this.canvas.getContext("2d");
    this.context.canvas.width = 700;
    this.context.canvas.height = 400;
    this.data = {
      imageElement: this.screen.nativeElement,
      results: [],
    };

    this.context.drawImage(
      this.screen.nativeElement,
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    const dataURL = this.canvas.toDataURL();
    console.log(dataURL);

    // var image = new Image();
    // image.setAttribute("crossorigin", "anonymous");
    // image.src = this.canvas.toDataURL();
    // console.log(image);

    // this.canvas.toBlob(function (blob) {
    //   //  link.href = URL.createObjectURL(blob);
    //   console.log(blob);
    //   // console.log(link.href); // this line should be here
    // }, "image/png");

    // var imgData = this.context.getImageData(
    //   this.screen.nativeElement,
    //   0,
    //   0,
    //   this.context.canvas.width,
    //   this.context.canvas.height
    // );
    // const base64Canvas = this.context
    //   .toDataURL("image/jpeg")
    //   .split(";base64,")[1];
    // console.log(imgData);

    // const b = new Promise((resolve) => {
    //   this.canvas.toBlob(resolve); // implied image/png format
    // });
    // console.log(b);

    // const a = this.canvas.toDataURL("image/jpeg");

    // const file = this.DataURIToBlob(a);
    // console.log(file);

    // this.face.saveSnapshot(file).subscribe(
    //   (res: any) => {
    //     console.log(res);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  drawRect(event: any) {
    this.canvas = this.rd.selectRootElement(event.target);
    this.context = this.canvas.getContext("2d");
    // console.log(this.data);
    this.goAnnotate(event);
  }

  getBackground() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `url(http://localhost:8080/api/pictures/manualTriggers/75a21aae-4f9c-4df8-ba70-8da80b950f1c/1612186776095.jpg)`
    );
  }

  goAnnotate(event) {
    // this.getAnn(i);
    // this.getLabels(i);
    this.re_draw();
    let x, y, rect;
    // if (this.objDet == false) {
    // console.log("here3", this.label);
    //   if (this.label != undefined) {
    this.count++;
    //  this.showMyMessage = false;
    //  this.on = false;
    //  this.id = undefined;
    if (this.count == 1) {
      this.context.beginPath();
      //  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.re_draw();
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      this.coords.push({ x: x, y: y });
      this.context.moveTo(x, y);
      //  this.context.fillStyle = "white";
      this.context.fillRect(x - 2, y - 2, 4, 4);
    } else if (this.count == 2) {
      this.count = 0;
      // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      rect = this.canvas.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      //  this.context.fillStyle = "lime";
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
      // this.coords.push({
      //   label: this.label + " " + (this.data[i]["results"].length + 1),
      // });
      this.context.lineWidth = 2.5;
      this.context.stroke();
      this.data["results"].push(this.coords);
      // if (!this.annObj.hasOwnProperty(this.data[i].id)) {
      //   this.annObj[this.data[i].id] = {
      //     image: this.data[i].image,
      //     width: this.data[i].res_width,
      //     height: this.data[i].res_height,
      //     canvas_width: this.data[i].width,
      //     canvas_height: this.data[i].height,
      //     results: this.data[i]["results"],
      //     fixedSize: this.data[i]["results"].length,
      //     annotationType: this.data[i].annotationType,
      //   };
      // } else {
      //   this.annObj[this.data[i].id].results = this.data[i]["results"];
      // }
      // this.labels.push(this.label + (this.data[i]["results"].length + 1));
      // this.labelsObj[this.data[i].id] = this.labels;
      // this.labels = this.labelsObj[this.data[i].id];
      this.re_draw();
      this.coords = [];
    }
    // } else {
    //   this.showMyMessage = true;
    //   setTimeout(() => {
    //     this.showMyMessage = false;
    //   }, 5000);
    // }
    //  }
  }

  re_draw() {
    for (let e = 0; e < this.data["results"].length; e++) {
      //  this.context.fillStyle = "lime";
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
    const reqData = {
      description: this.description,
      cameraId: this.camera,
    };
    console.log(this.data);
    this.face.manualTrigger(reqData).subscribe(
      (res: any) => {
        console.log(res);
        this.closeModal();
      },
      (error) => {
        console.log(error);
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
    actions: {
      position: "right",
      columnTitle: "ACTIONS",
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

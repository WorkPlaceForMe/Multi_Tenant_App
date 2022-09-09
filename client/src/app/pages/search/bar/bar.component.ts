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
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { FacesService } from "../../../services/faces.service";
import { api } from "../../../models/API";
import { Account } from "../../../models/Account";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NbDialogRef,
  NbDialogService,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import {
  SetngsComponent,
  WindowResultService,
} from "../setngs/setngs.component";
import { CheckComponent } from "../check/check.component";
import { AddIncidentComponent } from "../add-incident/add-incident.component";
import { MemoComponent } from "../memo/memo.component";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "ngx-bar",
  templateUrl: "./bar.component.html",
  styleUrls: ["./bar.component.scss"],
})
export class BarComponent implements OnInit, OnDestroy {
  dialogRef: NbDialogRef<any>;
  constructor(
    private face: FacesService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    public authService: AuthService
  ) {}

  ngOnDestroy() {}

  searchSet: any;

  selectedNavItem(item: any) {
    this.searchSet = item;
  }

  ngOnInit(): void {
    // console.log(this.windowRef)
    this.registerForm = this.formBuilder.group({
      query: ["", [Validators.required]],
    });
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
    const time = new Date();
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
  }
  registerForm: FormGroup;
  timezone: any;
  results: Array<any> = [];
  query: string;
  touched: boolean = false;
  loading: boolean = false;
  source: any = new LocalDataSource();
  stuff: Array<any> = [];
  now_user: Account;
  video: boolean = false;
  filters: any = {};

  check() {
    console.log(this.source);
  }

  videoStitch() {
    for (const log of this.source.data) {
      if (log.added == true) {
        console.log(log);
      }
    }
  }

  addIncident() {
    this.dialogRef = this.dialogService.open<any>(AddIncidentComponent, {
      hasScroll: true,
      dialogClass: "model-full",
      closeOnBackdropClick: false,
    });

    this.dialogRef.onClose.subscribe((resp) => {
      console.log(resp);
    });
  }

  search() {
    let inp = this.registerForm.controls["query"].value;
    this.loading = true;
    this.touched = false;
    this.stuff = [];
    this.source.data = [];
    let sending = {
      query: inp,
      id: this.now_user.id_branch,
    };
    if (this.filters !== {}) {
      sending["filters"] = this.filters;
    }
    this.face.searchElast(sending).subscribe(
      (res) => {
        this.loading = false;
        this.touched = true;
        this.results = res["data"];

        for (const m of this.results["hits"]) {
          if (m._source.time) {
            let dd = new Date(m["_source"]["time"]).getUTCDate().toString();
            let mm = new Date(m["_source"]["time"]).getMonth().toString();
            let yy = new Date(m["_source"]["time"]).getFullYear().toString();
            let hh = new Date(m["_source"]["time"]).getUTCHours().toString();
            let mi = new Date(m["_source"]["time"]).getUTCMinutes().toString();
            let ss = new Date(m["_source"]["time"]).getUTCSeconds().toString();
            const time = new Date(
              Number(yy),
              Number(mm),
              Number(dd),
              Number(hh),
              Number(mi),
              Number(ss)
            );
            m["_source"]["time"] = this.datepipe.transform(
              time,
              "yyyy-M-dd HH:mm:ss"
            );
            m["_source"]["base64"] = "/assets/images/loading.jpg";
            m["_source"]["id"] = m._id;
            this.stuff.push(m._source);
          }
        }

        this.source.load(
          this.stuff
            .slice()
            .sort((a, b) => +new Date(b.time) - +new Date(a.time))
        );
        // console.log(this.source)
        // this.face.getImagesElast().subscribe(res=>{
        //     let imgs = res['data'].hits.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))
        //     for(let i = 0; i < this.source.data.length; i ++){
        //       this.source.data[i].time = this.datepipe.transform(this.source.data[i].time, 'yyyy-M-dd HH:mm:ss');
        //       this.source.data[i].base64 = imgs[i]._source.base64
        //     }
        //     this.source.load(this.source.data)
        //   }, err => {
        //     console.error(err)
        //   })
      },
      (err) => {
        this.loading = false;
        this.touched = true;
        console.error(err);
      }
    );
  }

  openWindowForm() {
    this.windowService.open(SetngsComponent, {
      title: `Filter Settings`,
      context: {
        onChange: (changes) => {
          this.filters = changes;
        },
        filters: this.filters,
      },
    });
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
  videoFile: string = "";
  pass(ev) {
    this.video = true;
    console.log(ev);
    ev = ev.data.clip_path;
    this.videoplayer.nativeElement.src = ev;
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();
  }

  settings = {
    mode: "external",
    // actions: {
    //   position: 'right',
    //   add: false,
    //   edit: true,
    //   columnTitle: 'ACTIONS',
    //   delete: false,
    // },
    actions: false,
    edit: {
      editButtonContent: '<i class="fas fa-play"></i>',
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
      add: {
        title: "Summary",
        type: "custom",
        filter: false,
        renderComponent: CheckComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {});
        },
      },
      url: {
        title: "Picture",
        type: "custom",
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {
            this.pass(row);
          });
        },
      },
      description: {
        title: "Description",
        type: "string",
        filter: false,
      },
      time: {
        title: "Time",
        type: "string",
        filter: false,
      },
      cam_name: {
        title: "Camera",
        type: "string",
        filter: false,
      },
      button: {
        title: "Actions",
        type: "custom",
        valuePrepareFunction: (value, row, cell) => {
          return row;
        },
        renderComponent: MemoComponent,
        filter: false,
      },
    },
  };
}

@Component({
  selector: "button-view",
  styles: [
    ".play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}",
  ],
  template: `
    <div class="card border-info" style="width:63px; height: 62px">
      <img [src]="rowData.url" width="60" height="60" />
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

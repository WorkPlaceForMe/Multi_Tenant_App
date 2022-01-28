import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
} from "@angular/core";
import { Camera } from "../../../models/Camera";
import { FacesService } from "../../../services/faces.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { TrustedUrlPipe } from "../../../pipes/trusted-url.pipe";
import JSMpeg from "@cycjimmy/jsmpeg-player";

@Component({
  selector: "app-live",
  templateUrl: "./live.component.html",
  styleUrls: ["./live.component.css"],
})
export class LiveComponent implements OnInit {
  @Input() camera: string;
  live: Camera = {
    id: "",
    name: "",
    rtsp_in: "",
    rtsp_out: "",
    cam_height: 0,
    cam_width: 0,
  };
  link: SafeResourceUrl;
  ffmpege: any;
  resp: any;
  load: boolean = false;
  ports: any = [];
  message: boolean = false;
  status: any = {};
  sanitizer: DomSanitizer;
  on: boolean = false;
  rtspIn: SafeResourceUrl;
  constructor(
    private facesService: FacesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    sanitizer: DomSanitizer,
    private face: FacesService
  ) {
    this.sanitizer = sanitizer;
    this.link = sanitizer.bypassSecurityTrustResourceUrl(this.live.rtsp_out);
  }

  @ViewChild("streaming", { static: false }) streamingcanvas: ElementRef;

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.player != undefined) {
      this.player.destroy();
      this.player = null;
      this.face.cameraStop({ id: this.live.id }).subscribe(
        (res) => {},
        (err) => console.error(err)
      );
    }
  }

  ngAfterViewInit() {}

  resize() {
    let styles = {
      height: this.height,
      width: this.width,
    };
    return styles;
  }

  width: number;
  height: number;
  otro_cual: number = 2;
  nose: number = 0;
  player: any;
  streams: any = [];
  stre: any = [];
  newLink: TrustedUrlPipe;

  ngOnInit() {
    let camId: string;
    if (this.camera) {
      this.loadCam(this.camera);
    } else if (
      this.activatedRoute.snapshot &&
      this.activatedRoute.snapshot.params
    ) {
      const params = this.activatedRoute.snapshot.params;
      camId = params.id;
      if (camId) this.loadCam(camId);
    }
  }

  isHttpStream: boolean = false;

  loadCam(camId) {
    this.facesService.getCamera(camId).subscribe(
      (res) => {
        const rtspIn =
          res["data"]["http_in"] ||
          "http://13.76.172.134:3300/api/pictures/videos/b.mp4"; // FOR TESTING
        if (rtspIn && rtspIn.startsWith("http")) {
          this.isHttpStream = true;
          this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(rtspIn);
          return;
        } else {
          this.isHttpStream = false;
        }
        this.live = res["data"];
        this.face.camera({ id: this.live.id }).subscribe(
          (res) => {
            this.player = new JSMpeg.Player(
              `ws://${res["my_ip"]}:${res["port"]}`,
              {
                canvas: this.streamingcanvas.nativeElement,
                autoplay: true,
                audio: false,
                loop: true,
              }
            );
          },
          (err) => console.error(err)
        );
        if (window.innerWidth >= 1200) {
          this.width = 835;
          this.height = 400;
        } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
          this.width = 640;
          this.height = 480;
        } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
          this.width = 490;
          this.height = 368;
        } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
          this.width = 420;
          this.height = 315;
        }
      },
      (err) => console.error(err)
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth >= 1200) {
      this.width = 835;
      this.height = (this.width * this.live.cam_height) / this.live.cam_width;
      //   if(this.height >= 480){
      //     this.height = 480;
      //     this.width = this.height*this.live.cam_width/this.live.cam_height;
      // }
    } else if (window.innerWidth < 1200 && window.innerWidth >= 992) {
      this.width = 684;
      this.height = (this.width * this.live.cam_height) / this.live.cam_width;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.live.cam_width) / this.live.cam_height;
      }
    } else if (window.innerWidth < 992 && window.innerWidth >= 768) {
      this.width = 490;
      this.height = (this.width * this.live.cam_height) / this.live.cam_width;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.live.cam_width) / this.live.cam_height;
      }
    } else if (window.innerWidth < 768 && window.innerWidth >= 576) {
      this.width = 420;
      this.height = (this.width * this.live.cam_height) / this.live.cam_width;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.live.cam_width) / this.live.cam_height;
      }
    } else if (window.innerWidth < 576) {
      this.width = window.innerWidth - 140;
      this.height = (this.width * this.live.cam_height) / this.live.cam_width;
      if (this.height >= 480) {
        this.height = 480;
        this.width = (this.height * this.live.cam_width) / this.live.cam_height;
      }
    }
  }
}

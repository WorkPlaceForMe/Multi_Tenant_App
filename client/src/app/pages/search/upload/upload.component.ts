import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FacesService } from "../../../services/faces.service";
import {
  FileUploader,
  FileLikeObject,
  FileItem,
  ParsedResponseHeaders,
} from "ng2-file-upload";
import { api } from "../../../models/API";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";

const URL = `${api}/elastic/video`;
const uploadZipURL = `${api}/elastic/zip`;

@Component({
  selector: "ngx-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit {
  constructor(
    private router: Router,
    private token: AuthService,
    private facesService: FacesService,
    private SpinnerService: NgxSpinnerService
  ) {}
  messageBar: string = "Procesando";
  fileName: string;
  up: boolean = false;
  load: boolean = false;
  name: string;
  s3: boolean = false;
  progress: number = 0;
  finished: boolean = false;
  zipFileName: string;
  zipName: string;
  zipLoad: boolean = false;
  zipUploadFinished: boolean = false;

  @ViewChild("fileInput", { static: false }) fileInputVariable: any;
  @ViewChild("zipFileInput", { static: false }) zipFileInputVariable: any;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: "file",
    allowedFileType: ["video"],
    headers: [{ name: "x-access-token", value: this.token.getToken() }],
  });

  public zipUploader: FileUploader = new FileUploader({
    url: uploadZipURL,
    itemAlias: "file",
    headers: [{ name: "x-access-token", value: this.token.getToken() }],
  });

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      //this.SpinnerService.show();
      file.withCredentials = false;
      const format = file.file.name.split(".")[1];
      const name = this.name.split(" ").join("_");
      const newName = name + "." + format;
      file.file.name = newName;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      //this.SpinnerService.hide();
      console.log(response);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.up = false;
      // this.load = false;
      this.fileInputVariable.nativeElement.value = "";
      this.fileName = null;
      this.name = null;
      this.addRoI(JSON.parse(response));
    };
    this.uploader.onProgressItem = (progress: any) => {
      this.progress = progress["progress"];
      // this.progress = this.messageBar
      if (progress["progress"] === 100) {
        //this.SpinnerService.hide();
        this.finished = true;
      }
    };

    // Upload Zip File
    this.zipUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const format = file.file.name.split(".")[1];
      const name = this.zipName.split(" ").join("_");
      const newName = name + "." + format;
      file.file.name = newName;
    };
    this.zipUploader.onErrorItem = (item, response, status, headers) => {
      console.log(response);
    };
    this.zipUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.up = false;
      this.zipFileInputVariable.nativeElement.value = "";
      this.zipFileName = null;
      this.zipName = null;
      this.addRoI(JSON.parse(response));
    };
    this.zipUploader.onProgressItem = (progress: any) => {
      this.progress = progress["progress"];
      if (progress["progress"] === 100) {
        this.zipUploadFinished = true;
      }
    };
  }

  change() {
    this.fileName = null;
    if (this.fileInputVariable.nativeElement.files.length !== 0) {
      this.up = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]["name"];
      this.load = false;
    } else {
      this.up = false;
    }
  }

  onChangeZip() {
    this.zipFileName = null;
    if (this.zipFileInputVariable.nativeElement.files.length !== 0) {
      this.up = true;
      this.zipFileName =
        this.zipFileInputVariable.nativeElement.files[0]["name"];
      this.zipLoad = false;
    } else {
      this.up = false;
    }
  }

  uploadVideo() {
    this.up = true;
    this.load = true;
    const fileType = this.fileInputVariable.nativeElement.files[0].type;
    const fileFormat = fileType.split("/")[0];
    this.fileInputVariable.nativeElement.value = "";
    if (fileFormat === "video") {
      this.uploader.uploadAll();
    } else {
      this.fileName = null;
      this.load = false;
      alert("Porfavor elegir formato de video");
    }
  }

  uploadZip() {
    this.up = true;
    this.zipLoad = true;
    const fileType = this.zipFileInputVariable.nativeElement.files[0].type;
    this.zipFileInputVariable.nativeElement.value = "";
    if (fileType === "application/zip") {
      this.zipUploader.uploadAll();
    } else {
      this.zipFileName = null;
      this.zipLoad = false;
      alert("Please choose zip file only");
    }
  }

  addRoI(res) {
    let response = {
      cam_id: res.id,
    };

    this.facesService.doOneImage(response).subscribe(
      (res) => {
        // console.log(res)
        //this.router.navigate(['/pages/cameras/algorithms/' + id]);
        this.router.navigateByUrl("/pages/search/list");
      },
      (err) => {
        // console.error(err)
        //this.router.navigate(['/pages/cameras/algorithms/' + id]);
        this.router.navigateByUrl("/pages/search/list");
      }
    );
  }
}

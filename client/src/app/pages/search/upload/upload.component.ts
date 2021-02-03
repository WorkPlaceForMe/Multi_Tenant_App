import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { FileUploader, FileLikeObject, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { api } from '../../../models/API';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

const URL = `${api}/elastic/video`;

@Component({
  selector: 'ngx-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {

  constructor(
    private router: Router,
    private token: AuthService,
    private facesService: FacesService,
    private SpinnerService: NgxSpinnerService,
  ) { }
  fileName: string;
  up: boolean = false;
  load: boolean = false;
  name: string;
  s3:boolean = false;

  @ViewChild('fileInput', { static: false }) fileInputVariable: any;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'file',
    allowedFileType: ['video'],
    headers: [{ name: 'x-access-token', value: this.token.getToken() }],
  });


  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      this.SpinnerService.show();
      file.withCredentials = false;
      const format = file.file.name.split('.')[1];
      const name = this.name.split(' ').join('_');
      const newName = name + '.' + format;
      file.file.name = newName;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(response);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.up = false;
      this.load = false;
      this.fileInputVariable.nativeElement.value = '';
      this.fileName = null;
      this.name = null;
      this.addRoI(JSON.parse(response));
    };
    this.uploader.onProgressItem = (progress: any) => {
      console.log(progress['progress']);
      if (progress['progress'] === 100) {
        this.SpinnerService.hide();
        console.log('uploaded');
      }
    };

  }

  change() {
    this.fileName = null;
    if (this.fileInputVariable.nativeElement.files.length !== 0) {
      this.up = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]['name'];
      this.load = false;
    } else {
      this.up = false;
    }
  }

  uploa() {
    this.up = true;
    this.load = true;
    this.fileInputVariable.nativeElement.value = '';
    this.uploader.uploadAll();
  }

  addRoI (res) {
    let response = {
      cam_id: res.id,
    };
    this.facesService.doOneImage(response).subscribe(
      res => {
        // console.log(res)
        //this.router.navigate(['/pages/cameras/algorithms/' + id]);
        this.router.navigateByUrl('/pages/search/list');
      },
      err => {
        // console.error(err)
        //this.router.navigate(['/pages/cameras/algorithms/' + id]);
        this.router.navigateByUrl('/pages/search/list');
      }
    )
  }
}

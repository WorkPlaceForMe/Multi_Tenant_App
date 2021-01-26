import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { api } from '../../../models/API';

const URL = `${api}/elastic/video`

@Component({
  selector: 'ngx-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(
    private face: FacesService,
    ) { }
  fileName: string;
  up:boolean = false;
  load:boolean = false;

  @ViewChild("fileInput", {static:false}) fileInputVariable: any;
  public uploader:FileUploader = new FileUploader({
    url: URL, 
    itemAlias: 'file'
  });

  ngOnInit(): void {

    this.uploader.onAfterAddingFile = (file)=> { 
      file.withCredentials = false; 
      file.file.name = this.fileName;
      console.log(file)
    };  
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("Uploaded:", status, response, headers);
      this.up = false;
      this.load = false;
       this.fileInputVariable.nativeElement.value = '';
       this.fileName = '';
  };   
  this.uploader.onProgressItem = (progress: any) => {
   console.log(progress['progress']);
   if(progress['progress'] == 100){
   }
  };

  }

  change(){
    this.fileName = ''
    if(this.fileInputVariable.nativeElement.files.length != 0){
      this.up = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]['name']
      this.load = false;
    }else{
      this.up = false;
    }
  }
  uploa(){
    this.up = true;
    this.load = true;
    this.uploader.uploadAll();
  }
}
